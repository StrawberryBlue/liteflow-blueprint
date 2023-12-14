import { DataflowNode } from 'rete-engine';
import {ClassicPreset, ClassicPreset as Classic} from 'rete';

const socket = new Classic.Socket('socket');
export class CompentNode extends ClassicPreset.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super(initial);

        this.addInput('last', new Classic.Input(socket, '上级'));
        this.addOutput('next', new Classic.Output(socket, '下级'));


    }
    data(inputs: { last?: string }) {
        const { last } = inputs
        const value = last;
        console.log("自定义节点:" + value)
        return {
            next:value
        };
    }
}
