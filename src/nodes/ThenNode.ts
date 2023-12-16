import {DataflowNode} from 'rete-engine';
import {ClassicPreset as Classic} from 'rete';
import {nodeUtil} from "@/utils/UtilsExport";




const socket = new Classic.Socket('socket');

export class ThenNode extends Classic.Node implements DataflowNode {


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
        const { last } = inputs
        let nextValue = 'THEN( $ )';
        if (last != undefined){
            nextValue = last.toString().replace('$','THEN( )' + '\n');
        }
        const isRoot = nodeUtil.isRoot(this);
        console.log("isRoot:" + isRoot)

        return {
            next:nextValue,
            child:nextValue
        };
    }


}
