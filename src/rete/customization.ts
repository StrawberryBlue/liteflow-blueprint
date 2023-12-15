import {NodeEditor, GetSchemes, ClassicPreset} from 'rete';

import {Area2D, AreaExtensions, AreaPlugin} from 'rete-area-plugin';
import {
  ConnectionPlugin, Presets as ConnectionPresets,
} from 'rete-connection-plugin';

import { VuePlugin, VueArea2D, Presets as VuePresets } from 'rete-vue-plugin';

import CustomNode from '@/customui/CustomNode.vue';
import CustomConnection from '@/customui/CustomConnection.vue';
import CustomSocket from '@/customui/CustomSocket.vue';
import {
  ContextMenuExtra,
  ContextMenuPlugin,
  Presets as ContextMenuPresets,
} from 'rete-context-menu-plugin';

import { addCustomBackground } from '@/customui/custom-background';
import {ElStartNode} from "@/nodes/ELStartNode";
import {Presets as SveltePresets, SvelteArea2D, SveltePlugin} from "rete-svelte-plugin";
import {DataflowEngine} from "rete-engine";
import {AutoArrangePlugin,Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {ThenNode} from "@/nodes/ThenNode";
import {SwitchNode} from "@/nodes/SwitchNode";
import {CompentNode} from "@/nodes/CompentNode";
import {ElEndNode} from "@/nodes/ELEndNode";
import {WhenNode} from "@/nodes/WhenNode";
import {IfNode} from "@/nodes/IfNode";
import CustomButton from "@/customui/CustomButton.vue";
import CustomMenu from "@/customui/CustomMenu";



type Schemes = GetSchemes<any, any>

type AreaExtra =
    | Area2D<Schemes>
    | VueArea2D<Schemes>
    | SvelteArea2D<Schemes>
    | ContextMenuExtra;

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
  //创建自定义上下文菜单
  const contextMenu = CustomMenu(editor,area);
  //创建autoArrange插件 实现节点自动排列
  const arrange = new AutoArrangePlugin<Schemes>();
  //创建dataflow插件
  const dataflow = new DataflowEngine<Schemes>();

  //编辑器添加插件
  editor.use(area);

  area.use(connection);
  area.use(vueRender);
  area.use(svelteRender);
  area.use(contextMenu);
  arrange.addPreset(ArrangePresets.classic.setup());
  area.use(arrange);

  editor.use(dataflow);





  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });


  // noinspection TypeScriptValidateJSTypes
  vueRender.addPreset(
    VuePresets.classic.setup({
      customize: {
        node() {
          return CustomNode;
        },
        socket() {
          return CustomSocket;
        },
        connection() {
          return CustomConnection;
        },
        // control(context){
        //   if (context.payload.isButton) {
        //     return CustomButton;
        //   }
        // }
      },
    })
  );

  addCustomBackground(area);


  connection.addPreset(ConnectionPresets.classic.setup());
  vueRender.addPreset(VuePresets.classic.setup());
  vueRender.addPreset(VuePresets.contextMenu.setup());
  svelteRender.addPreset(SveltePresets.classic.setup());
  svelteRender.addPreset(SveltePresets.contextMenu.setup());

  //自动将所选节点置于最前面
  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.selectableNodes(area,AreaExtensions.selector(),{
    accumulating: AreaExtensions.accumulateOnCtrl()
  });


  setTimeout(() => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 300);

  //dataflow实时计算方法
  async function process() {
    dataflow.reset();
    for (const node of editor
        .getNodes()) {
          const next = await dataflow.fetch(node.id);
          console.log(node.label + "["+ node.id + "]", 'produces', next);
        }
  }

  editor.addPipe((context) => {
    if (context.type === 'connectioncreated' || context.type === 'connectionremoved') {
      process();
    }
    return context;
  });

  await process();

  return {
    destroy: () => area.destroy(),
  };
}
