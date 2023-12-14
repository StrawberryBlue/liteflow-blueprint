import {NodeEditor, GetSchemes, ClassicPreset} from 'rete';

import {Area2D, AreaExtensions, AreaPlugin} from 'rete-area-plugin';
import {
  ConnectionPlugin, Presets as ConnectionPresets,
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
import {Presets as SveltePresets, SvelteArea2D, SveltePlugin} from "rete-svelte-plugin";
import {DataflowEngine} from "rete-engine";
import {AutoArrangePlugin,Presets as ArrangePresets} from "rete-auto-arrange-plugin";
import {ThenNode} from "@/nodes/ThenNode";
import {SwitchNode} from "@/nodes/SwitchNode";
import {CompentNode} from "@/nodes/CompentNode";
import {ElEndNode} from "@/nodes/ELEndNode";
import {WhenNode} from "@/nodes/WhenNode";
import {IfNode} from "@/nodes/IfNode";
import CustomButton from "@/customization/CustomButton.vue";



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
  //创建上下文菜单插件
  // @ts-ignore
  const contextMenu = new ContextMenuPlugin<Schemes>({
    //设置默认菜单
    items: ContextMenuPresets.classic.setup(
      [
          ['默认组件',
            [
              ['EL START', () => new ElStartNode("EL开始")],
              ['THEN', () => new ThenNode("THEN")],
              ['SWITCH', () => new SwitchNode("SWITCH")],
              ['WHEN', () => new WhenNode("WHEN")],
              ['IF', () => new IfNode("IF")],
              ['EL END', () => new ElEndNode("EL结束")]
            ]
          ],
          ["自定义组件",
            [
              ['A', () => new CompentNode("自定义A")],
              ['B', () => new CompentNode("自定义B")],
              ['C', () => new CompentNode("自定义C")],
              ['D', () => new CompentNode("自定义D")],
            ]
          ],
        ["逻辑组件",
          [
            ['A', () => new CompentNode("自定义A")],
            ['B', () => new CompentNode("自定义B")],
            ['C', () => new CompentNode("自定义C")],
            ['D', () => new CompentNode("自定义D")],
          ]
        ]

    ]),
  });


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
    if (
        context.type === 'connectioncreated' ||
        context.type === 'connectionremoved'
    ) {
      process();
    }
    return context;
  });

  process();

  return {
    destroy: () => area.destroy(),
  };
}
