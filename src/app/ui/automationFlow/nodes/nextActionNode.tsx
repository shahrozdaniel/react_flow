import { useCallback, useContext } from "react";
import {
  getOutgoers,
  Handle,
  Position,
  useReactFlow,
  Node,
} from "@xyflow/react";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LabelIcon from "@mui/icons-material/Label";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion } from "framer-motion";
import { AutomationContext } from "@/app/ui/automationFlow/context";
import EventIcons from "@/app/ui/automationFlow/eventIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const handleStyle = { bottom: -5 };
const TrigerClasses = "w-56 max-w-56 flex flex-row relative";
import { useReactFlowNode } from "@/lib/hooks/useReactFlowNode";

const typeToIconMap = {
  whatsAppTemplate: "template",
  whatsAppMessage: "message",
  addToDNC: "doNotDistrub",
  addToContact: "addContact",
};

const subdataClasses = "text-[11px] text-muted-foreground";

export function NextActionNode(props: any) {
  const { id, data, isConnectable } = props;
  const { formData } = data;
  const { setAutomationState } = useContext(AutomationContext);
  // console.log(" data : ", data);
  const { deleteNode } = useReactFlowNode();
  const { getEdges, getNodes, deleteElements } = useReactFlow();
  const outgoers = getOutgoers({ id } as Node, getNodes(), getEdges());
  const showDropDownMenu = outgoers.length === 0;

  const handleAddNode = (id: string) => {
    setAutomationState((prev: any) => {
      return {
        ...prev,
        isSidebarOpen: true,
        clickedNodeId: id,
        showNodeType: "triggerNode",
        nodeInnerNextActionType: null,
        editNode: false,
      };
    });
  };
  const handleEditNode = () => {
    setAutomationState((prev: any) => {
      return {
        ...prev,
        isSidebarOpen: true,
        clickedNodeId: id,
        showNodeType: data.nodeType,
        editNode: true,
        editNodeData: data,
        nodeInnerNextActionType: data.actionType,
      };
    });
  };
  const handleDeleteNode = () => {
    deleteNode(id);
  };

  return (
    <div className={TrigerClasses}>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={isConnectable}
      />

      <div
        className="flex grow gap-2 justify-center items-center border-2 border-slate-200 rounded-md bg-white p-2 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:duration-500 hover:shadow-md"
        //onClick={handleEditNode}
      >
        <div className="shrink-0">
          {data.actionType && (
            <EventIcons type={data.actionType} fontsize={16} />
          )}
        </div>
        <div className="flex flex-row grow">
          <div className="grow">
            <div className="w-40 text-[13px] text truncate ...">
              {data.label}
            </div>
            {/* <LabelIcon className='w-5 bg-slate-100 p-1 rounded'/> */}

            {data.formData.contactList && (
              <p className={subdataClasses}>
                {" "}
                <EventIcons type={"addContact"} fontsize={12} />{" "}
                {data.formData.contactList}
              </p>
            )}
            {formData.actionValue && (
              <p className="text-[11px] w-40 text-muted-foreground truncate ...">
                {" "}
                <EventIcons
                  type={
                    // @ts-ignore
                    typeToIconMap[formData.actionType]
                  }
                  fontsize={12}
                />{" "}
                {formData.actionValue}
              </p>
            )}
            {data.formData.notifierNumber && (
              <p className={subdataClasses}>
                {" "}
                <EventIcons type={"phoneNotification"} fontsize={12} />{" "}
                {data.formData.notifierNumber}
              </p>
            )}
            {formData.actionValueOther && (
              <p className="text-[11px] text-muted-foreground w-40 truncate ...">
                {" "}
                <EventIcons
                  type={
                    // @ts-ignore
                    typeToIconMap[formData.actionTypeOther]
                  }
                  fontsize={12}
                />{" "}
                other:{formData.actionValueOther}
              </p>
            )}
          </div>
          {showDropDownMenu && (
            <div className="shrink-0 cursor-pointer -mt-1 -mr-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreVertIcon
                    sx={{ fontSize: 16 }}
                    className="text-blue-600"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={handleEditNode}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteNode}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        {formData.tag && (
          <p className="text-[11px] bg-primary px-2 rounded-lg absolute left-2 -top-3 text-white">
            <EventIcons type={"tag"} fontsize={10} /> {formData.tag}
          </p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        style={handleStyle}
        className="!bg-transparent !border-none !cursor-pointer relative"
      >
        <motion.div
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.4, x: -2, y: -2 }}
          onClick={() => {
            handleAddNode(id);
          }}
        >
          <AddCircleIcon className="text-blue-600 absolute -left-2" />
        </motion.div>
      </Handle>
    </div>
  );
}
