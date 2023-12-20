import {NodeEditor, GetSchemes, ClassicPreset, ConnectionBase, NodeBase} from 'rete';

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

} from 'rete-context-menu-plugin';

import { addCustomBackground } from '@/customui/custom-background';
import {Presets as SveltePresets, SvelteArea2D, SveltePlugin} from "rete-svelte-plugin";
import {DataflowEngine} from "rete-engine";
import {AutoArrangePlugin,Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import CustomMenu from "@/customui/CustomMenu";
import {nodeUtil} from "@/utils/UtilsExport";




export type Schemes = GetSchemes<any, any>

export type AreaExtra =
    | Area2D<Schemes>
    | VueArea2D<Schemes>
    | SvelteArea2D<Schemes>
    | ContextMenuExtra;
//创建编辑器
export var editor = new NodeEditor<Schemes>();

//创建dataflow插件
export var dataflow = new DataflowEngine<Schemes>();

export async function createEditor(container: HTMLElement) {
  //创建 areaPlug
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  //创建 connectionPlugin
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  //创建 vueRender
  const vueRender = new VuePlugin<Schemes, AreaExtra>();
  //创建 svelteRender
  const svelteRender = new SveltePlugin<Schemes, AreaExtra>();
  //创建自定义上下文菜单
  const contextMenu = CustomMenu(area);
  //创建autoArrange插件 实现节点自动排列
  const arrange = new AutoArrangePlugin<Schemes>();


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
    for (const node of editor.getNodes()) {
      if (node.label == 'EL END') {
        const next = await dataflow.fetchInputs(node.id);
        const END = await dataflow.fetch(node.id).catch(e=>{console.log('this is END')});
        console.info(node.label + "[" + node.id + "]", 'produces', next, END);
      } else {
        const input = await dataflow.fetchInputs(node.id);
        const next = await dataflow.fetch(node.id);
        console.info(node.label + "[" + node.id + "]", 'input:', input,' \n output:',next);
      }

    }
  }

  editor.addPipe(async (context) => {
    if (context.type === 'connectioncreated'
        || context.type === 'connectionremoved') {
      await process().catch(e => console.log(e));
      //当新连接产生时重新计算两次，避免缓存数据导致输入错误
      await process().catch(e => console.log(e));
    }
    return context;
  });

  await process().catch(e=>console.log(e));

  return {
    destroy: () => area.destroy(),
  };
}
