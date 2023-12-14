import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';

const socket = new Classic.Socket('socket');
export class IfNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('IF');

        this.addInput('flag', new Classic.Input(socket, '条件'));
        this.addOutput('next', new Classic.Output(socket, '下级'));
        this.addOutput('true', new Classic.Output(socket, 'true'));
        this.addOutput('false', new Classic.Output(socket, 'false'));

    }
    data(inputs: { flag?: string }) {
        const { flag } = inputs
        const value = flag;
        console.log("IF NODE节点:" + value)
        return {
            next:value,
            true:value,
            false:value
        };
    }
}
