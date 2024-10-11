"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Form } from "@repo/ui/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BarLoader } from "react-spinners";
import { useCreateEmission } from "~/hooks/useCreateEmission";
import { useGetEmissions } from "~/hooks/useGetEmissions";
import { usePagination } from "~/hooks/usePagination";
import type {
  MobileEmissionCreateSchema,
  MobileEmissionsReponse,
} from "~/schema/mobileEmissionSchema";
import {
  CREATE_MOBILE_EMISSION_DEFAULT_VALUE,
  CreateMobileEmissionDialog,
} from "./components/create-mobile-emission-dialog";
import { CreateMobileEmissionForm } from "./components/create-mobile-emission-form";
import { Layout } from "./components/layout";
import { TablePagination } from "./components/table-pagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { useDeleteEmission } from "~/hooks/useDeleteEmission";

export default function Page() {
  const [createDialog, setCreateDialog] = useState(false);
  const { skip, take } = usePagination();

  const { data: emissions, isLoading } = useGetEmissions({
    skip,
    take,
  });

  const noMobileEmissions = !emissions?.total;

  const spinner = <BarLoader color="#4fd1c5" />;
  const content = noMobileEmissions ? <NoItems /> : <EmissionList />;

  return (
    <main className="h-full w-full">
      <Layout
        bottomBar={noMobileEmissions ? undefined : <BottomBar />}
      >
        <div className="flex flex-col justify-center items-center w-full h-full border-y px-8 py-4">

        <div className="flex flex-col w-full">
          <span>Ano de referência: {new Date().getFullYear()}</span>
          <span className="font-bold text-2xl">Combustão móvel</span>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-full">
          {isLoading ? spinner : content}
        </div>
        <CreateMobileEmissionDialog
          open={createDialog}
          onOpenChange={setCreateDialog}
        />
        </div>
      </Layout>
    </main>
  );
}

function BottomBar() {
  const router = useRouter();

  return (
    <div className="h-full w-full flex items-center justify-end px-4 pt-4">
      <Button
        onClick={() => {
          router.push("/results");
        }}
        size="xl"
      >
        <Send /> Concluir
      </Button>
    </div>
  );
}

function NoItems() {
  const [createDialog, setCreateDialog] = useState(false);

  return (
    <div className="flex flex-col gap-2 items-center h-full w-full justify-center">
      <CreateMobileEmissionDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
      />
      <span className="font-bold">
        Adicione todas as fontes de combustão estacionárias desta unidade.
      </span>
      <Button
        variant="default"
        size="xl"
        className="w-fit"
        onClick={() => {
          setCreateDialog(true);
        }}
      >
        Adicionar novo dado
      </Button>
    </div>
  );
}

const ModalTypeMap: Record<string, string> = {
  road: "Rodoviário",
  rail: "Ferroviário",
  air: "Aéreo",
  waterway: "Hidroviário",
};

function EmissionList() {
  const [selectedId, setSelectedId] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);

  const cachedData = useQueryClient().getQueryData<MobileEmissionsReponse>([
    "get-emissions",
  ]);

  const { mutateAsync: createEmission, isPending } = useCreateEmission();

  const form = useForm<MobileEmissionCreateSchema>({
    defaultValues: CREATE_MOBILE_EMISSION_DEFAULT_VALUE,
  });
  const { handleSubmit, reset } = form;

  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(
    async ({ quantity, ...data }: MobileEmissionCreateSchema) => {
      await createEmission({
        ...data,
        quantity: Number(quantity),
      })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["get-emissions"],
          });
          toast.success("Emissão adicionada com sucesso!");
          reset(CREATE_MOBILE_EMISSION_DEFAULT_VALUE);
        })
        .catch(() => {
          toast.error("Erro ao adicionar emissão!");
        });
    },
  );

  return (
    <div className="flex flex-col w-full gap-4 p-5 relative">
      <DeleteEmissionDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        selectedId={selectedId}
      />
      <Table className="w-full h-full">
        <TableHeader className="w-full">
          <TableRow>
            <TableHead>Fonte</TableHead>
            <TableHead>Combustível</TableHead>
            <TableHead>Modal</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Total t CO2e</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cachedData?.data.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.source}</TableCell>
              <TableCell>{data.fuel_type}</TableCell>
              <TableCell>{ModalTypeMap[data.mode]}</TableCell>
              <TableCell>
                {data.quantity}{" "}
                <span className="capitalize">{data.quantity_unit}</span>
              </TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="icon"
                  onClick={() => {
                    setSelectedId(data.id);
                    setDeleteDialog(true);
                  }}
                >
                  <Trash size={20} />
                </Button>
              </TableCell>
              <TableCell>{data.co2e.toFixed(3)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination totalItems={cachedData?.total ?? 0} />
      <div className="p-4 flex gap-2 bg-zinc-100 w-full">
        <Form {...form}>
          <form onSubmit={onSubmit} className="p-4 flex gap-2 items-end w-full">
            <CreateMobileEmissionForm />
            <Button type="submit" loading={isPending}>
              Salvar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

type DeleteEmissionDialogProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  selectedId: string;
};

function DeleteEmissionDialog({
  onOpenChange,
  open,
  selectedId,
}: DeleteEmissionDialogProps) {
  const { mutateAsync: deleteEmission, isPending } = useDeleteEmission();
  const queryClient = useQueryClient();

  const onSubmit = async () => {
    await deleteEmission(selectedId);
    await queryClient.invalidateQueries({
      queryKey: ["get-emissions"],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir emissão</DialogTitle>
        </DialogHeader>
        <div className="w-full flex items-center justify-center">
          Você tem certeza que deseja excluir esta fonte de emissão?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            loading={isPending}
            className="w-full"
            variant="default"
            onClick={onSubmit}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
