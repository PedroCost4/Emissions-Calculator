import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Form } from "@repo/ui/components/ui/form";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@repo/ui/components/ui/button";
import type { MobileEmissionCreateSchema } from "~/schema/mobileEmissionSchema";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCreateEmission } from "~/hooks/useCreateEmission";
import { CreateMobileEmissionForm } from "./create-mobile-emission-form";

type CreateMobileEmissionDialogProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export const CREATE_MOBILE_EMISSION_DEFAULT_VALUE: MobileEmissionCreateSchema =
  {
    source: "",
    fuel_type: "",
    quantity: 0,
    mode: "road",
    quantity_unit: "",
  };

export function CreateMobileEmissionDialog({
  onOpenChange,
  open,
}: CreateMobileEmissionDialogProps) {
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
          toast.success("Emissão adicionada com sucesso!");
          queryClient.invalidateQueries({
            queryKey: ["get-emissions"],
          });
          onOpenChange(false);
          reset(CREATE_MOBILE_EMISSION_DEFAULT_VALUE);
        })
        .catch(() => {
          toast.error("Erro ao adicionar emissão!");
        });
    },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar nova emissão móvel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-16 w-full" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2 w-full">
              <CreateMobileEmissionForm />
            </div>
            <DialogFooter className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button className="w-full" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                loading={isPending}
                type="submit"
                className="w-full"
                variant="default"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
