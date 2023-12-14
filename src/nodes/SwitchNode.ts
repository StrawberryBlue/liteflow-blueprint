import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';

const socket = new Classic.Socket('socket');
export class SwitchNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('SWITCH');

        this.addInput('last', new Classic.Input(socket, '上级'));
        this.addInput('flag', new Classic.Input(socket, '条件'));
        this.addOutput('case1', new Classic.Output(socket, '分支1'));
        this.addOutput('case2', new Classic.Output(socket, '分支2'));
        this.addOutput('case3', new Classic.Output(socket, '分支3'));

    }
    data(inputs: { last?: string,flag?: string }) {
        const { last,flag } = inputs

        console.log("SWITCH 节点:" + last + "--" + flag)
        return {
            case1:last + "--" + flag,
            case2:last + "--" + flag,
            case3:last + "--" + flag,

        };
    }
}
