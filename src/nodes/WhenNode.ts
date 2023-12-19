import { DataflowNode } from 'rete-engine';
import { ClassicPreset as Classic } from 'rete';
import {nodeUtil} from "@/utils/UtilsExport";

const socket = new Classic.Socket('socket');
export class WhenNode extends Classic.Node implements DataflowNode {
    msgBody:string = '';

    constructor(initial: string, change?: (value: string) => void) {
        super('WHEN');

        this.addInput('last',new Classic.Input(socket, '上级'));
        const flag = new Classic.Input(socket, '条件');
        //设置可以多输入
        flag.multipleConnections = true;
        this.addInput('flag',flag);
        this.addOutput('next', new Classic.Output(socket, '下级'));

    }
    data(inputs: { last?: string,flag?: string[] }) {

        let { last,flag } = inputs
        console.log("jdslkafjsaodfjwbjfjksahd:"+last,flag);
        if (!last){
            last = '$';
        }
        if (!flag){
            flag = [];
        }

        this.msgBody = 'WHEN(';

        for (let i = 0; i < flag.length; i++) {
            const item = flag[i].replaceAll(',$','');
            this.msgBody = this.msgBody + item;
            if (i < flag.length - 1) {
                this.msgBody = this.msgBody + ',';
            }
        }
        this.msgBody = this.msgBody + ')';


        this.msgBody = last.toString().replaceAll('$',this.msgBody);


        if (!(nodeUtil.isLeaves(this))){
            this.msgBody = this.msgBody + ',$';
        }

        console.log(this.msgBody);
        return {
            next: this.msgBody,
        };
    }
}
