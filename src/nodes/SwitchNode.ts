import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';
import {nodeUtil} from "@/utils/UtilsExport";

const socket = new Classic.Socket('socket');
export class SwitchNode extends Classic.Node implements DataflowNode {
    msgBody:string = '$'

    constructor(initial: string, change?: (value: string) => void) {
        super('SWITCH');

        this.addInput('last', new Classic.Input(socket, '上级'));
        this.addInput('flag', new Classic.Input(socket, '条件'));
        this.addOutput('next', new Classic.Output(socket, '下级'));
        this.addOutput('branch', new Classic.Output(socket, '分支'));


    }
    data(inputs: { last?: string,flag?: string}) {
        let { last,flag} = inputs

        if (!last){
            last = '$';
        }
        if(!flag){
            flag = '$';
        }

        this.msgBody = 'SWITCH(' + flag.toString().replaceAll(',$','') + ').to($)';

        //当THEN节点有子集时，先获取子集信息
        if (nodeUtil.getNextNode(this,'branch').length>0){
            let lnStr = '';
            //获取child 的所有叶子
            const leaves = nodeUtil.getLeaves(this,'branch');
            for (let i = 0; i < leaves.length; i++) {
                lnStr = lnStr + leaves[i].msgBody;
                if (i != leaves.length - 1){
                    lnStr = lnStr + ',';
                }
            }

            console.log("AAAAAAAAAAAA:" + this.msgBody);
            console.log("bbbbbbbbbbb:" + lnStr);

            // @ts-ignore
            this.msgBody = this.msgBody.toString().replace('$', lnStr);
        }else {
            // @ts-ignore
            this.msgBody = this.msgBody.toString().replace('$','');
        }
        console.log("ccccccccccccc:" + this.msgBody);
        this.msgBody = last.toString().replaceAll('$',this.msgBody);
        console.log("dddddddddddddd:" + this.msgBody);

        if (!(nodeUtil.isLeaves(this))){
            this.msgBody = this.msgBody + ',$';
        }


        return {
            next: this.msgBody,
            branch: '$'
        };
    }
}
