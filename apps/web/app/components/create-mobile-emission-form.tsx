import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { useFormContext } from "react-hook-form";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repo/ui/components/ui/select";
import type { MobileEmissionCreateSchema } from "~/schema/mobileEmissionSchema";
import { useFuelTypes } from "~/hooks/useFuelTypes";

export function CreateMobileEmissionForm() {
  const form = useFormContext<MobileEmissionCreateSchema>();
  const { control, setValue } = form;

  const { data: fuelTypes } = useFuelTypes()

  return (
    <>
      <FormField
        control={control}
        name="source"
        rules={{
          required: "Esse campo é obrigatório",
        }}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 w-full">
            <FormLabel>Fonte</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite aqui" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="fuel_type"
        rules={{
          required: "Esse campo é obrigatório",
        }}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 w-full">
            <FormLabel>Tipo de combustível</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={(value) => {
                field.onChange(value);
                setValue("quantity_unit", fuelTypes?.find((fuelType) => fuelType.fuel === value)?.quantity_unit ?? "", { shouldDirty: true });
              }}> 
                <SelectTrigger {...field}>
                  <SelectValue placeholder="Selecione aqui" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes?.map((fuelType) => (
                    <SelectItem key={fuelType.fuel} value={fuelType.fuel}>{fuelType.fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="mode"
        rules={{
          required: "Esse campo é obrigatório",
        }}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 w-full">
            <FormLabel>Modal</FormLabel>
            <FormControl>
            <Select onValueChange={field.onChange}> 
                <SelectTrigger {...field}>
                  <SelectValue placeholder="Selecione aqui" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="road">Rodoviário</SelectItem>
                  <SelectItem value="air">Aéreo</SelectItem>
                  <SelectItem value="waterway">Hidroviário</SelectItem>
                  <SelectItem value="rail">Ferroviário</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="quantity"
        rules={{
          min: {
            value: 0,
            message: "A quantidade tem valor mínimo de 0",
          },
          required: "Esse campo é obrigatório"
        }}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 w-full">
            <FormLabel>Quantidade</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite aqui" type="number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
