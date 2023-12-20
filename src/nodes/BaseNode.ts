import {ClassicPreset as Classic} from "rete";

export abstract class BaseNode extends Classic.Node {
    msgBody: string = '';
    toString(){
        super.toString();
    }
}