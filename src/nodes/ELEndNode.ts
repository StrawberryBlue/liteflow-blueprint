import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';
const socket = new Classic.Socket('socket');
export class ElEndNode extends Classic.Node implements DataflowNode {


    constructor(initial: string, change?: (value: string) => void) {
        super('EL END');
        const input = new Classic.Input(socket, '上级');
        //设置可以多输入
        input.multipleConnections = true;
        this.addInput('last',input);
        this.addControl(
            'id',
            new Classic.InputControl('text', { initial, change })
        );
    }
    data(inputs: { last?: string }) {
        const { last } = inputs
        const value = last;
        let elString = '';
        if (last != undefined){
            elString = last.toString().replace(',$','') + '; \n </chain>';
        }


        console.log("EL END节点" + elString)
        if (elString != ''){
            alert("编排完成: \n" + elString);
        }
        return {
            id: this.id,
            last: value
        };
    }
}
