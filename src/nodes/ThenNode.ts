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
    data() {
        const value = (this.controls['id'] as Classic.InputControl<'text'>)
            .value;
        return {
            next:value
        };
    }
}
