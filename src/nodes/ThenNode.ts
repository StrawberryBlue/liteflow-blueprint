import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';

const socket = new Classic.Socket('socket');
export class ThenNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('THEN');

        this.addInput('last', new Classic.Input(socket, '上级'));
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
