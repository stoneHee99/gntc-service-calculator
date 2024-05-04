"use client";

import Layout from "@/app/layout";
import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";

import {
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const referenceDate = new Date(2024, 5, 30);
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );

  const changeYear = (offset: number) => {
    const newYear = currentYear + offset;
    setCurrentYear(newYear);

    const newDate = new Date(date || new Date());
    newDate.setFullYear(newYear);
    setDate(newDate);
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(date || new Date());
    newDate.setMonth(newDate.getMonth() + offset);
    setDate(newDate);
    setCurrentYear(newDate.getFullYear());
  };

  const handleMonthChangeFromPicker = (month: Date) => {
    setDate(month);
    setCurrentYear(month.getFullYear());
  };

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
        <div className="flex justify-center items-center my-4">
          <ChevronLeftIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => changeYear(-1)}
          />
          <span className="mx-4">{currentYear}년</span>
          <ChevronRightIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => changeYear(1)}
          />
        </div>
        <div className="my-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow mx-auto w-fit"
            month={
              new Date(currentYear, date?.getMonth() ?? new Date().getMonth())
            }
            onMonthChange={handleMonthChangeFromPicker}
          />
          <div className="flex justify-center my-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  봉사를 쉬신 기간이 있으신가요?
                </AccordionTrigger>
                <AccordionContent className="mx-auto">
                  <Button>추가하기</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </Layout>
  );
}
