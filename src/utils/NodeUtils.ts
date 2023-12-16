
import {editor, Schemes} from "@/rete/customization";
import {ClassicPreset as Classic, NodeEditor} from "rete";



export default class NodeUtils{

    nodeEditor: NodeEditor<Schemes>;
    constructor() {
        this.nodeEditor = editor;
    }

    updateEditor(editor:NodeEditor<Schemes>){
        this.nodeEditor = editor;
    }

    checkEditor(){
        return this.nodeEditor != undefined;

    }

    /**
     * 获取节点上所有inputConnections
     * @param nodeId
     */
    getAllInputConnections(nodeId:string):any[]{
        this.updateEditor(editor);
        const connections = this.nodeEditor.getConnections();
        return connections.filter(connection => connection.target === nodeId);
    }

    /**
     * 获取节点上所有outputConnections
     * @param nodeId
     */
    getAllOutputConnections(nodeId:string):any[]{
        this.updateEditor(editor);
        const connections = this.nodeEditor.getConnections();
        return connections.filter(connection => connection.source === nodeId);
    }

    /**
     * 获取节点所有父节点
     * @param nodeId
     */
    getAllInputNode(nodeId:string) : any[] {
        this.updateEditor(editor);
        const inputConnections = this.getAllInputConnections(nodeId);
        const incomers = inputConnections.map(c => editor.getNode(c.source));
        return Array.from(new Set(incomers));
    }

    /**
     * 获取节点所有子节点
     * @param nodeId
     */
    getAllOutputNode(nodeId:string):any{
        this.updateEditor(editor);
        const outputConnections = this.getAllOutputConnections(nodeId);
        const outgoers = outputConnections.map(c => editor.getNode(c.target));
        return Array.from(new Set(outgoers));
    }

    /**
     * 获取所有根节点
     */
    getAllRoots():any{
        const nodes = this.nodeEditor.getNodes();
        return nodes.filter(node => {
            const connections = this.getAllInputConnections(node.id);
            return connections == null || connections.length === 0;
        });
    }

    /**
     * 获取所有叶子节点
     */
    getAllLeaves():any{
        const nodes = this.nodeEditor.getNodes();
        return nodes.filter(node => {
            const connections = this.getAllOutputConnections(node.id);
            return connections == null || connections.length === 0;
        });
    }

    /**
     * 判断节点是否为根节点
     * @param node
     */
    isRoot(node:Classic.Node):any{
        const connections = this.getAllInputConnections(node.id);
        console.log(connections);
        return connections == null || connections.length === 0;
    }


    /**
     * 判断节点是否为根节点
     * @param node
     */
    isLeaves(node:Classic.Node):any{
        const connections = this.getAllOutputConnections(node.id);
        return connections == null || connections.length === 0;
    }

}
