import {DataflowNode} from 'rete-engine';
import {ClassicPreset as Classic} from 'rete';
import {nodeUtil} from "@/utils/UtilsExport";
import {BaseNode} from "@/nodes/BaseNode";




const socket = new Classic.Socket('socket');

export class ThenNode extends BaseNode implements DataflowNode {

    msgBody:string = 'THEN( $ )';
    msgChild:string = '$';


    //定义节点名称，输入、输出接口和输入框
    constructor(initial: string,change?: (value: string) => void) {
        super('THEN');
        const input = new Classic.Input(socket, '上级');
        //设置可以多输入
        // input.multipleConnections = true;
        this.addInput('last',input);
        this.addOutput('next', new Classic.Output(socket, '下级'));
        this.addOutput('child', new Classic.Output(socket, '子集'));

    }
    data(inputs: { last?: string }) {
        let { last } = inputs

        /**
         * 1.先判断该节点是否为其他节点的子节点,当上一个节点的引脚不为next时,该节点为子节点
         * 2.如果该节点不为子节点，获取到该节点的子节点的所有叶子节点，获取到他们的 msgBody ，并填充到input输入信息中
         * 3.如果为子节点,则以该节点为root节点 向下传递msgBody，
         */
        if (nodeUtil.isRoot(this)){
            last = '$';
        }
        //当THEN节点有子集时，先获取子集信息
        if (nodeUtil.getNextNode(this,'child').length>0){
            let lnStr = '';
            //获取child 的所有叶子
            const leaves = nodeUtil.getLeaves(this,'child');
            for (let i = 0; i < leaves.length; i++) {
                lnStr = lnStr + leaves[i].msgBody;
                if (i != leaves.length - 1){
                    lnStr = lnStr + ',';
                }
            }
            console.log("last " + last + "   " + lnStr)
            // @ts-ignore
            this.msgBody = last.toString().replace('$','THEN(' + lnStr +')');
        }else {
            // @ts-ignore
            this.msgBody = last.toString().replace('$','THEN($)');
        }

        if (!(nodeUtil.isLeaves(this))){
            this.msgBody = this.msgBody + ',$';
        }



        return {
            next:this.msgBody,
            child:this.msgChild
        };
    }


}
