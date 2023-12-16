import { DataflowNode } from 'rete-engine';
import {ClassicPreset, ClassicPreset as Classic} from 'rete';



const socket = new Classic.Socket('socket');
export class CompentNode extends ClassicPreset.Node implements DataflowNode {


    /**
     * 所有自定义节点都使用该节点生成，节点名称为传入的initial
     * @param initial
     * @param change
     */
    constructor(initial: string, change?: (value: string) => void) {
        super(initial);
        const input = new Classic.Input(socket, '上级');
        //设置可以多输入
        input.multipleConnections = true;
        this.addInput('last',input);
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
