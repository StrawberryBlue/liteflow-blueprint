import {NodeEditor, GetSchemes, ClassicPreset, ClassicPreset as Classic} from 'rete';

import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {
  Connection,
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';

import { VuePlugin, VueArea2D, Presets as VuePresets } from 'rete-vue-plugin';

import CustomNode from '../customization/CustomNode.vue';
import CustomConnection from '../customization/CustomConnection.vue';
import CustomSocket from '../customization/CustomSocket.vue';
import {
  ContextMenuExtra,
  ContextMenuPlugin,
  Presets as ContextMenuPresets,
} from 'rete-context-menu-plugin';

import { addCustomBackground } from '@/customization/custom-background';
import {ElStartNode} from "@/nodes/ELStartNode";
import {Presets as SveltePresets, SveltePlugin} from "rete-svelte-plugin";
import {DataflowEngine} from "rete-engine";
import {AutoArrangePlugin} from "rete-auto-arrange-plugin";
import {ThenNode} from "@/nodes/ThenNode";
import {SwitchNode} from "@/nodes/SwitchNode";
import {CompentNode} from "@/nodes/CompentNode";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = VueArea2D<Schemes> | ContextMenuExtra;


// class Connection<A extends Node, B extends Node> extends Classic.Connection<A,B> {}


const socket = new ClassicPreset.Socket('socket');

export async function createEditor(container: HTMLElement) {
  //创建编辑器
  const editor = new NodeEditor<Schemes>();
  //创建 areaPlug
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  //创建 connectionPlugin
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  //创建 vueRender
  const vueRender = new VuePlugin<Schemes, AreaExtra>();
  //创建 svelteRender
  const svelteRender = new SveltePlugin<Schemes, AreaExtra>();
  //创建上下文菜单插件
  const contextMenu = new ContextMenuPlugin<Schemes>({
    //设置默认菜单
    items: ContextMenuPresets.classic.setup([
      ['EL START', () => new ElStartNode("EL开始")],
      ['THEN', () => new ThenNode("THEN")],
      ['SWITCH', () => new SwitchNode("SWITCH")],
      ['CUSTOM', () => new CompentNode("自定义A")],
    ]),
  });


  //创建autoArrange插件 实现节点自动排列
  // const arrange = new AutoArrangePlugin<Schemes>();
  //创建dataflow插件
  // const dataflow = new DataflowEngine<Schemes>();

  //编辑器添加插件
  editor.use(area);

  area.use(connection);
  area.use(vueRender);
  area.use(svelteRender);
  area.use(contextMenu);
  // editor.use(dataflow);


  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });


  vueRender.addPreset(
    VuePresets.classic.setup({
      customize: {
        node(context) {
          return CustomNode;
        },
        socket() {
          return CustomSocket;
        },
        connection() {
          return CustomConnection;
        },
      },
    })
  );

  addCustomBackground(area);


  connection.addPreset(ConnectionPresets.classic.setup());
  vueRender.addPreset(VuePresets.classic.setup());
  vueRender.addPreset(VuePresets.contextMenu.setup());
  svelteRender.addPreset(SveltePresets.classic.setup());
  svelteRender.addPreset(SveltePresets.contextMenu.setup());

  AreaExtensions.simpleNodesOrder(area);


  setTimeout(() => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 300);

  return {
    destroy: () => area.destroy(),
  };
}
