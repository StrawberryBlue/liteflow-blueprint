import {ContextMenuExtra, ContextMenuPlugin} from "rete-context-menu-plugin";
import {ElStartNode} from "@/nodes/ELStartNode";
import {ThenNode} from "@/nodes/ThenNode";
import {SwitchNode} from "@/nodes/SwitchNode";
import {WhenNode} from "@/nodes/WhenNode";
import {IfNode} from "@/nodes/IfNode";
import {ElEndNode} from "@/nodes/ELEndNode";
import {CompentNode} from "@/nodes/CompentNode";
import {ClassicPreset} from "rete";
import {AreaPlugin} from "rete-area-plugin";
import {AreaExtra, editor, Schemes} from "@/rete/customization";






export default (area: AreaPlugin<Schemes, AreaExtra>) => {



    return new ContextMenuPlugin<Schemes>({
        //设置自定义菜单
        items(context, plugin) {
            if (context === 'root') {
                return {
                    searchBar: false,
                    list: [
                        {
                            label: '默认组件', key: '1', handler: () => null,
                            subitems: [
                                { label: 'EL START', key: '1-1', handler: () => {
                                        const node = new ElStartNode("EL开始");
                                        editor.addNode(node).then(r => {
                                            area.translate(node.id, { x: 0, y: 0 });
                                        });
                                    }
                                },
                                { label: 'THEN', key: '1-2', handler: () => {
                                        editor.addNode(new ThenNode("THEN"));
                                    }
                                },
                                { label: 'SWITCH', key: '1-3', handler: () => {
                                        editor.addNode(new SwitchNode("SWITCH"));
                                    }
                                },
                                { label: 'WHEN', key: '1-4', handler: () => {
                                        editor.addNode(new WhenNode("WHEN"));
                                    }
                                },
                                { label: 'IF', key: '1-5', handler: () => {
                                        editor.addNode(new IfNode("IF"));
                                    }
                                },
                                { label: 'EL END', key: '1-6', handler: () => {
                                        editor.addNode(new ElEndNode("EL END"));
                                    }
                                },
                            ]
                        },
                        {
                            label: '自定义组件', key: '2', handler: () => null,
                            subitems: [
                                { label: 'A', key: '2-1', handler: () =>  {
                                        editor.addNode(new CompentNode("A"));
                                    }
                                },
                                { label: 'B', key: '2-2', handler: () =>  {
                                        editor.addNode(new CompentNode("B"));
                                    }
                                },
                                { label: 'C', key: '2-3', handler: () =>  {
                                        editor.addNode(new CompentNode("C"));
                                    }
                                },
                                { label: 'D', key: '2-1', handler: () =>  {
                                        editor.addNode(new CompentNode("D"));
                                    }
                                },

                            ]
                        },
                        {
                            label: '逻辑组件', key: '3', handler: () => null,
                            subitems: [
                                { label: '与', key: '3-1', handler: () => {
                                        editor.addNode(new CompentNode("AND"));
                                    }
                                },
                                { label: '或', key: '3-2', handler: () => {
                                        editor.addNode(new CompentNode("OR"));
                                    }
                                },
                                { label: '取反', key: '3-3', handler: () => {
                                        editor.addNode(new CompentNode("NOT"));
                                    }
                                },
                            ]
                        },
                    ]
                }
            }
            return {
                searchBar: false,
                list: [
                    {
                        label: '删除', key: '1', handler: () => {
                            const node = context as ClassicPreset.Node;
                            const nodeId = node.id;
                            const connections = editor.getConnections();
                            connections.forEach((c)=>{
                                if (c.source == nodeId || c.target == nodeId){
                                    editor.removeConnection(c.id);
                                }
                            })
                            editor.removeNode(nodeId);
                        }
                    },
                ]
            }
        }
    });
}