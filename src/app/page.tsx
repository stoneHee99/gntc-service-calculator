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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [datesOff, setDatesOff] = React.useState<(DateRange | undefined)[]>([]);
  const referenceDate = new Date(2024, 5, 30);
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );

  const addNewDateOff = () => {
    setDatesOff([
      ...datesOff,
      { from: new Date(), to: addDays(new Date(), 5) },
    ]);
  };

  const removeDateOff = (index: number) => {
    const newDatesOff = [...datesOff];
    newDatesOff[index] = undefined;
    setDatesOff(newDatesOff.filter((item) => item !== undefined));
  };

  const calculateDifference = (selectedDate: Date) => {
    let difference = referenceDate.getTime() - selectedDate.getTime();
    datesOff.forEach((dateRange) => {
      if (dateRange && dateRange.from && dateRange.to) {
        difference -= dateRange.to.getTime() - dateRange.from.getTime();
      }
    });
    return Math.round(difference / (1000 * 60 * 60 * 24));
  };

  const dateDifference = date ? calculateDifference(date) : "";

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
          <div className="flex justify-center my-20">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  봉사를 쉬신 기간이 있으신가요?
                </AccordionTrigger>
                <AccordionContent className="mx-auto">
                  <Button onClick={addNewDateOff}>기간 추가</Button>
                  {datesOff.map((dateRange, index) => (
                    <div key={index}>
                      <DatePickerWithRange
                        date={dateRange}
                        onDateChange={(newRange) => {
                          const newDatesOff = [...datesOff];
                          newDatesOff[index] = newRange;
                          setDatesOff(newDatesOff);
                        }}
                      />
                      <Button onClick={() => removeDateOff(index)}>X</Button>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </Layout>
  );
}

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  onDateChange: (newRange: DateRange | undefined) => void;
}

function DatePickerWithRange({ date, onDateChange }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-norma mt-2 mr-2",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date && date.from && date.to
            ? `${date.from.toDateString()} - ${date.to.toDateString()}`
            : "날짜를 선택하세요"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode="range" selected={date} onSelect={onDateChange} />
      </PopoverContent>
    </Popover>
  );
}
