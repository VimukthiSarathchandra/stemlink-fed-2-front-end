import { ChevronDown, Plus, Edit, Package, BarChart3 } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function AdminDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Admin
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/admin/products/create" className="flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            Create Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin/products/update" className="flex items-center gap-2 cursor-pointer">
            <Edit className="h-4 w-4" />
            Update Product
          </Link>
        </DropdownMenuItem>
                    <DropdownMenuItem asChild>
              <Link to="/admin/orders" className="flex items-center gap-2 cursor-pointer">
                <Package className="h-4 w-4" />
                Admin Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/sales" className="flex items-center gap-2 cursor-pointer">
                <BarChart3 className="h-4 w-4" />
                Sales Dashboard
              </Link>
            </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
