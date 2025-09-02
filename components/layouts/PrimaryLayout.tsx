import AppSidebar from "@/components/structureComps/AppSidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from "@/components/structureComps/Header"

export default function Page( { children }: { children: React.ReactNode } ) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main>
          <div className="flex-1">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
