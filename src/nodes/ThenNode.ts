import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';

const socket = new Classic.Socket('socket');
export class ThenNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('THEN');
        const input = new Classic.Input(socket, '上级');
        //设置可以多输入
        input.multipleConnections = true;
        this.addInput('last',input);
        this.addOutput('next', new Classic.Output(socket, '下级'));
        this.addOutput('child', new Classic.Output(socket, '子集'));

    }
    data(inputs: { last?: string }) {
        const { last } = inputs
        const value = last;
        console.log("THEN节点" + value)
        return {
            next:value,
            child:value
        };
    }
}
