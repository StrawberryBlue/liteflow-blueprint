import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';
const socket = new Classic.Socket('socket');
export class ElEndNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('EL END');

        this.addInput('last', new Classic.Input(socket, '上级'));
        this.addControl(
            'id',
            new Classic.InputControl('text', { initial, change })
        );
    }
    data(inputs: { last?: string }) {
        const { last } = inputs
        const value = last;
        console.log("EL END节点" + value)
        return {
            id: this.id,
            last: value
        };
    }
}
