"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  ChartContainer,
  type ChartConfig
} from "@repo/ui/components/ui/chart";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useGetResults } from "~/hooks/useGetResults";
import type { Result } from "~/schema/mobileEmissionSchema";
import GHGLogo from "../../assets/ghg-logo.png";
import { Card } from "../components/card";
import { Layout } from "../components/layout";

export default function Page() {
  const { data, isLoading } = useGetResults();
  return (
    <Layout removeBottomBar topBar={<TopBar />}>
      <div className="bg-accent flex w-full justify-between p-4 ">
        <div className="flex flex-col w-full">
          <span className="font-bold text-2xl">Resultados</span>
          <span>Ano de referência: {new Date().getFullYear()}</span>
        </div>
        <Image src={GHGLogo.src} alt="ghg logo" width={120} height={40} />
      </div>
      <div className="flex flex-col w-full gap-4 p-4 h-full">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Card
            description="Soma da emissão de gases de efeito estufa de todos os Escopos convertidos em CO₂"
            title="Emissões totais CO₂ eq"
            unit="ton CO₂e"
            value={data?.co2e.toFixed(3) ?? "0"}
            className="max-w-1/2"
            loading={isLoading}
          />
          <Card
            description="Emissão de CO₂ total vinda de materiais orgânicos não fósseis"
            title="Emissões totais CO₂ biogênico"
            unit="ton CO₂"
            value={data?.co2.toFixed(3) ?? "0"}
            className="max-w-1/2"
            loading={isLoading}
          />
        </div>
        <Card
          description="Emissões por gases GEE (ton CO₂eq / % de impacto)"
          title="Contribuição de cada componente do estudo e seus respectivos inventários no single score total"
          className="max-w-full flex-col"
          loading={isLoading}
        >
          <BarChartInfo />
        </Card>
      </div>
    </Layout>
  );
}

const chartConfig = {
  co2: {
    label: "CO₂",
    color: "#6FCDC7",
  },
  ch4: {
    label: "CH₄",
    color: "#F5C2E7",
  },
  n2o: {
    label: "CH₄",
    color: "#E2F4F2",
  },
} satisfies ChartConfig;

function BarChartInfo() {
  const data = useQueryClient().getQueryData<Result>(["get-results"]);
  // eslint-disable-next-line no-unused-vars
  const { co2e: _, ...rest } = data ? data : {};

  const chartData = data
    ? Object.keys(rest).map((key) => {
        return {
          name: key,
          // @ts-ignore
          value: data[key].toFixed(3),
        };
      })
    : [];

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4fd1c5" barSize={150} />
      </BarChart>
    </ChartContainer>
  );
}

function TopBar() {
  const router = useRouter();

  return (
    <div className="h-full w-full flex items-center justify-start px-10">
      <Button
        variant="ghost"
        className="flex gap-2"
        onClick={() => {
          router.push("/");
        }}
      >
        <ArrowLeft /> Voltar
      </Button>
    </div>
  );
}
