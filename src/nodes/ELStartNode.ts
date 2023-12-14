import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';
const socket = new Classic.Socket('socket');
export class ElStartNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('EL START');

        this.addOutput('next', new Classic.Output(socket, '下级'));
        this.addControl(
            'id',
            new Classic.InputControl('text', { initial, change })
        );
    }
    data() {
        const value = (this.controls['id'] as Classic.InputControl<'text'>)
            .value;
        return {
            next:value
        };
    }
}
