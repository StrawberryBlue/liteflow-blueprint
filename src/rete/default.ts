import {ClassicPreset, ClassicPreset as Classic, GetSchemes, NodeEditor} from 'rete';

import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';

import { VuePlugin, VueArea2D, Presets as VuePresets } from 'rete-vue-plugin';

import {
  SveltePlugin,
  SvelteArea2D,
  Presets as SveltePresets,
} from 'rete-svelte-plugin';
import { DataflowEngine, DataflowNode } from 'rete-engine';
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from 'rete-auto-arrange-plugin';

import {
  ContextMenuPlugin,
  ContextMenuExtra,
  Presets as ContextMenuPresets,
} from 'rete-context-menu-plugin';

import {ElStartNode} from "@/nodes/ELStartNode";

type Node = NumberNode | AddNode | ElStartNode | ClassicPreset.Node;
type Conn =
  | Connection<NumberNode, AddNode>
  | Connection<AddNode, AddNode>
  | Connection<ElStartNode, AddNode>
  | Connection<ElStartNode, NumberNode>
  | Connection<AddNode, NumberNode>;
type Schemes = GetSchemes<Node, Conn>;

class Connection<A extends Node, B extends Node> extends Classic.Connection<
  A,
  B
> {}

class NumberNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 120;

  constructor(initial: number, change?: (value: number) => void) {
    super('Number');

    this.addOutput('value', new Classic.Output(socket, 'Number'));
    this.addControl(
      'value',
      new Classic.InputControl('number', { initial, change })
    );
  }
  data() {
    const value = (this.controls['value'] as Classic.InputControl<'number'>)
      .value;

    return {
      value,
    };
  }
}

class AddNode extends Classic.Node implements DataflowNode {
  width = 180;
  height = 195;

  constructor() {
    super('Add');

    this.addInput('a', new Classic.Input(socket, 'A'));
    this.addInput('b', new Classic.Input(socket, 'B'));
    this.addOutput('value', new Classic.Output(socket, 'Number'));
    this.addControl(
      'result',
      new Classic.InputControl('number', { initial: 0, readonly: true })
    );
  }
  data(inputs: { a?: number[]; b?: number[] }) {
    const { a = [], b = [] } = inputs;
    const sum = (a[0] || 0) + (b[0] || 0);

    (this.controls['result'] as Classic.InputControl<'number'>).setValue(sum);

    return {
      value: sum,
    };
  }
}

type AreaExtra =
  | Area2D<Schemes>
  | VueArea2D<Schemes>
  | SvelteArea2D<Schemes>
  | ContextMenuExtra;

const socket = new Classic.Socket('socket');

//初始化节点编辑器
export async function createEditor(container: HTMLElement) {
  //创建编辑器
  const editor = new NodeEditor<Schemes>();
  //创建区域扩展插件
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  //创建connection插件
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  //创建vueRender
  const vueRender = new VuePlugin<Schemes, AreaExtra>();
  //创建svelte插件
  const svelteRender = new SveltePlugin<Schemes, AreaExtra>();
  //创建上下文菜单插件
  const contextMenu = new ContextMenuPlugin<Schemes>({
    //设置默认菜单
    items: ContextMenuPresets.classic.setup([
      ['Number', () => new NumberNode(1, process)],
      ['Add', () => new AddNode()],
      ['EL START', () => new ElStartNode('开始')],
    ]),
  });

  //使用上面创建的插件
  editor.use(area);
  area.use(vueRender);
  area.use(svelteRender);
  area.use(connection);
  area.use(contextMenu);

  connection.addPreset(ConnectionPresets.classic.setup());
  vueRender.addPreset(VuePresets.classic.setup());
  vueRender.addPreset(VuePresets.contextMenu.setup());
  svelteRender.addPreset(SveltePresets.classic.setup());
  svelteRender.addPreset(SveltePresets.contextMenu.setup());

  //创建dataflow插件
  // const dataflow = new DataflowEngine<Schemes>();

  //使用dataflow插件
  // editor.use(dataflow);


  // 在页面上添加默认的节点，演示使用
  // const a = new NumberNode(1, process);
  // const b = new NumberNode(1, process);
  // const add = new AddNode();
  //
  // await editor.addNode(a);
  // await editor.addNode(b);
  // await editor.addNode(add);
  //
  // await editor.addConnection(new Connection(a, 'value', add, 'a'));
  // await editor.addConnection(new Connection(b, 'value', add, 'b'));


  //创建autoArrange插件 实现节点自动排列
  // const arrange = new AutoArrangePlugin<Schemes>();
  // arrange.addPreset(ArrangePresets.classic.setup());
  // area.use(arrange);
  //
  // await arrange.layout();

  AreaExtensions.zoomAt(area, editor.getNodes());

  AreaExtensions.simpleNodesOrder(area);

  const selector = AreaExtensions.selector();
  const accumulating = AreaExtensions.accumulateOnCtrl();


  //     console.log(node.id, 'produces', sum);
  //
  //     area.update(
  //       'control',  AreaExtensions.selectableNodes(area, selector, { accumulating });


  //dataflow实时计算方法
  async function process() {
    // dataflow.reset();
    // editor
    //   .getNodes()
    //   .filter((node) => node instanceof AddNode)
    //   .forEach(async (node) => {
    //     const sum = await dataflow.fetch(node.id);
    //       (node.controls['result'] as Classic.InputControl<'number'>).id
    //     );
    //   });
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
