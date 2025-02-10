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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AutomationContext } from "../context";
import { Button } from "@/components/ui/button";
import {useReactFlowNode} from '@/lib/hooks/useReactFlowNode'

const handleStyle = { bottom: -5 };
const TrigerClasses = "w-56 max-w-56 flex flex-row relative";

export function TriggerNode(props: any) {
  //   const onChange = useCallback((evt) => {
  //     console.log(evt.target.value);
  //   }, []);
  const { id, data, isConnectable } = props;

  const { setAutomationState } = useContext(AutomationContext);
  // console.log(" ----------- data : ", data);

  const { getEdges, getNodes, deleteElements } = useReactFlow();
  const {deleteNode} = useReactFlowNode()
  const outgoers = getOutgoers({ id } as Node, getNodes(), getEdges());
  const showDropDownMenu = outgoers.length === 0;

  const handleAddNode = (id: string) => {
    setAutomationState((prev: any) => {
      return {
        ...prev,
        isSidebarOpen: true,
        clickedNodeId: id,
        showNodeType: "eventNode",
        editNode: false,
        nodeInnerNextActionType: null,
      };
    });
  };

  const handleEditNode = () => {
    setAutomationState((prev: any) => {
      return {
        ...prev,
        isSidebarOpen: true,
        clickedNodeId: id,
        showNodeType: "triggerNode",
        editNode: true,
        nodeInnerNextActionType: null,
      };
    });
  };

  const handleDeleteNode = () => {
    deleteNode(id);
  };
  return (
    <div className={TrigerClasses}>
      {id !== "1" && (
        <Handle
          type="target"
          position={Position.Top}
          id="a"
          isConnectable={isConnectable}
        />
      )}
      <div
        className="flex grow gap-2 justify-center items-center border-2 border-slate-200 rounded-md bg-white p-2 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:duration-500 hover:shadow-md"
        // onClick={() => {handleEditNode()}}
      >
        <div className="shrink-0">
          {data.actionType === "EMAIL" ? (
            <MarkEmailUnreadIcon sx={{ fontSize: 16 }} />
          ) : (
            <WhatsAppIcon sx={{ fontSize: 16 }}/>
          )}
        </div>
        <div className="flex flex-row grow">
          <div className="flex flex-col grow">
            <label htmlFor="text-[13px]">{data.label}</label>
          </div>
          {showDropDownMenu && (
            <div className="shrink-0 cursor-pointer -mt-1 -mr-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreVertIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={handleEditNode}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteNode}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
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
          // animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.4, x: -2, y: -2 }}
          // className='flex p-1'
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
