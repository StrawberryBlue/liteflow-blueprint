import {DataflowEngine, DataflowNode} from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';
import {dataflow, editor} from "@/rete/customization";
import {result} from "@/nodes/Result";
const socket = new Classic.Socket('socket');
export class ElEndNode extends Classic.Node implements DataflowNode {
    msgBody:string = '';

    constructor(initial: string, change?: (value: string) => void) {
        super('EL END');
        this.addInput('last',new Classic.Input(socket, '上级'));
        this.addControl(
            'id',
            new Classic.InputControl('text', { initial, change })
        );
    }
    data(inputs: { last?: string }) {


        const {last} = inputs
        const value = last;
        let elString = '';
        dataflow.reset();


        if (last != undefined) {
            elString = last.toString().replaceAll(',$', '') + '; \n </chain>';
        }

        elString = elString.replaceAll('$', "");
        if (elString != '') {
            result.setData(elString);
        }

        this.msgBody = elString;

        return {
            id: this.id,
            last: value
        };
    }
}
