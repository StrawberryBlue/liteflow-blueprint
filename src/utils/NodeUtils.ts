
import {editor, Schemes} from "@/rete/customization";
import {ClassicPreset as Classic, NodeEditor} from "rete";
import {BaseNode} from "@/nodes/BaseNode";



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
        this.updateEditor(editor);
        const nodes = this.nodeEditor.getNodes();
        return nodes.filter(node => {
            const connections = this.getAllInputConnections(node.id);
            return connections == null || connections.length === 0;
        });
    }

    /**
     * 获取所有叶子节点
     */
    getAllLeaves():Classic.Node[]{
        this.updateEditor(editor);
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
        this.updateEditor(editor);
        const connections = this.getAllInputConnections(node.id);
        // console.log(connections);
        return connections == null || connections.length === 0;
    }


    /**
     * 判断节点是否为根节点
     * @param node
     */
    isLeaves(node:Classic.Node):any{
        this.updateEditor(editor);
        const connections = this.getAllOutputConnections(node.id);
        return connections == null || connections.length === 0;
    }
    /**
     * 获取指定输入的上一个节点
     * @param node 节点
     * @param inputName 引脚名称
     */
    getLastNode(node:Classic.Node,inputName:string):Classic.Node[]{
        let lastNodes:Classic.Node[] = [];
        this.updateEditor(editor);
        const inConns = this.getAllInputConnections(node.id);
        //获取指定引脚的所有输入connections
        const desInConns =  inConns.filter(c => {
            return c.targetInput == inConns;
        })
        desInConns.forEach(ic=>{
            const findNode = editor.getNode(ic.target);
            lastNodes.push(findNode);
        })
        return lastNodes;
    }

    /**
     * 获取指定引脚上级引脚名称
     * @param node
     * @param inputName
     */
    getInputPinsName(node:Classic.Node,inputName:string):string[]{
        let inputPinsNames:string[] = [];
        this.updateEditor(editor);
        const inConns = this.getAllInputConnections(node.id);
        //获取指定引脚的所有输入connections
        const desInConns =  inConns.filter(c => {
            return c.targetInput == inConns;
        })
        desInConns.forEach(ic =>{
            inputPinsNames.push(ic.targetInput);
        })
        return inputPinsNames;
    }

    /**
     * 获取指定输出的下一个节点
     * @param node 节点
     * @param outName 引脚名称
     */
    getNextNode(node:Classic.Node,outName:string):BaseNode[]{
        this.updateEditor(editor);
        let nextNode:BaseNode[] = [];
        this.updateEditor(editor);
        const outConns = this.getAllOutputConnections(node.id);
        //获取指定引脚的所有输出connections
        const desOutConns =  outConns.filter(c => {
            return c.sourceOutput == outName;
        })
        desOutConns.forEach(dc=>{
            const findNode = editor.getNode(dc.target);
            nextNode.push(findNode);
        })
        return nextNode;
    }


    /**
     * 获取指定输出节点的叶子节点
     */
    getLeaves(node:Classic.Node,outName:string):BaseNode[]{
        this.updateEditor(editor);
        let leavesNodes:BaseNode[] = [];
        this.getNextNode(node,outName).forEach(nextNode => {
            this.recursionLeaves(nextNode,'next',leavesNodes);
        })
        return leavesNodes;
    }

    /**
     * 遍历子节点的递归方法
     * @param node
     * @param outName
     * @param leavesNodes
     */
    recursionLeaves(node:Classic.Node,outName:string,leavesNodes:Classic.Node[]){
        const nextNodes = this.getNextNode(node,'next');
        if (nextNodes.length===0){
            leavesNodes.push(node);
        }else{
            //获取node的下级节点
            const nextNodes = this.getNextNode(node,outName);
            nextNodes.forEach(nn=>{
                this.recursionLeaves(nn,outName,leavesNodes);
            })
        }
    }

    haveEnd(editor:NodeEditor<Schemes>){
        let resp = false;
        editor.getNodes().forEach(n => {
            if (n.label === 'EL END'){
                resp = true;
            }
        })
        return resp;
    }

}
