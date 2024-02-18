"use client";

import Layout from "@/app/layout";
import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/calendar";

import { ClockIcon } from "@radix-ui/react-icons";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const referenceDate = new Date(2024, 5, 30);

  const calculateDifference = (selectedDate: Date) => {
    const difference = referenceDate.getTime() - selectedDate.getTime();
    return Math.round(difference / (1000 * 60 * 60 * 24));
  };

  const dateDifference = date ? calculateDifference(date) : "";

  return (
    <Layout>
      <main className="flex p-10 flex-col">
        <Alert>
          <ClockIcon></ClockIcon>
          <AlertTitle>근속 연수 계산기</AlertTitle>
          <AlertDescription>
            {date
              ? `선택하신 날짜를 기준으로 ${dateDifference}일 동안 근속하셨습니다.`
              : "날짜를 선택하시면 2024년 6월 30일 기준 근속 일수가 계산됩니다."}
          </AlertDescription>
        </Alert>
        <div className="my-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow mx-auto w-fit"
          />
        </div>
      </main>
    </Layout>
  );
}
