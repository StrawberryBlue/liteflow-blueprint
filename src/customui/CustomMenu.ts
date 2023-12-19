import {ContextMenuPlugin} from "rete-context-menu-plugin";
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
import { AsNode } from "@/nodes/AsNode";


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
                                            area.translate(node.id, {x: 0, y: 0})
                                                .then(r =>{});
                                        });
                                    }
                                },
                                { label: 'THEN', key: '1-2', handler: () => {
                                        editor.addNode(new ThenNode("THEN"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'SWITCH', key: '1-3', handler: () => {
                                        editor.addNode(new SwitchNode("SWITCH"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'WHEN', key: '1-4', handler: () => {
                                        editor.addNode(new WhenNode("WHEN"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'IF', key: '1-5', handler: () => {
                                        editor.addNode(new IfNode("IF"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'EL END', key: '1-6', handler: () => {
                                        editor.addNode(new ElEndNode("EL END"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'AS', key: '1-7', handler: () => {
                                        editor.addNode(new AsNode("AS"))
                                            .then(r => {});
                                    }
                                },
                            ]
                        },
                        {
                            label: '自定义组件', key: '2', handler: () => null,
                            subitems: [
                                { label: 'A', key: '2-1', handler: () =>  {
                                        editor.addNode(new CompentNode("A"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'B', key: '2-2', handler: () =>  {
                                        editor.addNode(new CompentNode("B"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'C', key: '2-3', handler: () =>  {
                                        editor.addNode(new CompentNode("C"))
                                            .then(r => {});
                                    }
                                },
                                { label: 'D', key: '2-1', handler: () =>  {
                                        editor.addNode(new CompentNode("D"))
                                            .then(r => {});
                                    }
                                },

                            ]
                        },
                        {
                            label: '逻辑组件', key: '3', handler: () => null,
                            subitems: [
                                { label: '与', key: '3-1', handler: () => {
                                        editor.addNode(new CompentNode("AND"))
                                            .then(r => {});
                                    }
                                },
                                { label: '或', key: '3-2', handler: () => {
                                        editor.addNode(new CompentNode("OR"))
                                            .then(r => {});
                                    }
                                },
                                { label: '取反', key: '3-3', handler: () => {
                                        editor.addNode(new CompentNode("NOT"))
                                            .then(r => {});
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
                                    editor.removeConnection(c.id)
                                        .then(r => {});
                                }
                            })
                            editor.removeNode(nodeId)
                                .then(r => {});
                        }
                    },
                ]
            }
        }
    });
}