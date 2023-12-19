import { DataflowNode } from 'rete-engine';
import {ClassicPreset, ClassicPreset as Classic} from 'rete';
import {nodeUtil} from "@/utils/UtilsExport";
const socket = new Classic.Socket('socket');
export class AsNode extends ClassicPreset.Node implements DataflowNode {

    msgBody:string = '';


    constructor(initial: string, change?: (value: string) => void) {
        super('AS');


        this.addInput('last', new Classic.Input(socket, '上级'));
        this.addOutput('next', new Classic.Output(socket, '下级'));
        this.addControl(
            'id',
            new Classic.InputControl('text', { initial ,change})
        );
    }
    data(inputs: { last?: string }) {
        let { last } = inputs;
        const value = (this.controls['id'] as Classic.InputControl<'text'>)
            .value;
        if (!last){
            if (!last){
                last = '$';
            }
        }
        this.msgBody = last.toString().replace(',$', '.id("' + value + '")');

        if (!(nodeUtil.isLeaves(this))){
            this.msgBody = this.msgBody + ',$';
        }

        return {
            next: this.msgBody,
        };
    }
}
