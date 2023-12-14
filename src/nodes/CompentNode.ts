import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';

const socket = new Classic.Socket('socket');
export class CompentNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super(initial);

        this.addInput('last', new Classic.Input(socket, '上级'));
        this.addOutput('next', new Classic.Output(socket, '下级'));


    }
    data() {
        const value = (this.controls['id'] as Classic.InputControl<'text'>)
            .value;
        console.log("自定义:"+value)
        return {
            next:value
        };
    }
}
