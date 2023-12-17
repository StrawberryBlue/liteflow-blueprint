import { DataflowNode } from 'rete-engine';
import {ClassicPreset, ClassicPreset as Classic} from 'rete';
import {nodeUtil} from "@/utils/UtilsExport";



const socket = new Classic.Socket('socket');
export class CompentNode extends ClassicPreset.Node implements DataflowNode {

    msgBody:string = this.label;
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
        let { last } = inputs

        if (last == undefined){
            last = this.label;
        }

        // @ts-ignore
        this.msgBody = last.toString().replace('$',this.label);


        //如果该节点不是叶子节点或者该节点的next节点不是end节点，则在msg后面添加 ‘,$’
        if (!nodeUtil.isLeaves(this)){
            this.msgBody = this.msgBody + ',$';
        }


        return {
            next:this.msgBody
        };
    }
}
