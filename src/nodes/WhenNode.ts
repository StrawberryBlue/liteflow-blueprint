import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';

const socket = new Classic.Socket('socket');
export class WhenNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('WHEN');

        this.addInput('flag1', new Classic.Input(socket, '条件1'));
        this.addInput('flag2', new Classic.Input(socket, '条件2'));
        this.addInput('flag3', new Classic.Input(socket, '条件3'));
        this.addOutput('next', new Classic.Output(socket, '下级'));

    }
    data(inputs: { flag1?: string,flag2?: string,flag3?: string }) {
        const { flag1,flag2,flag3 } = inputs
        console.log("WHEN 节点" + flag1 + "--" + flag2 + "--" + flag3)
        return {
            next: flag1 + "--" + flag2 + "--" + flag3,
        };
    }
}