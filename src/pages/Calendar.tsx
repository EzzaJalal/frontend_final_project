import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getTrainingsData } from "../services/TrainingService";
import { Training } from "../types";
import dayjs from "dayjs";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  resource: Training;
}

export default function TrainingCalendar() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("week");

  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainingsData();
        setTrainings(data || []);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setTrainings([]);
      }
    })();
  }, []);

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = trainings.map((training) => {
      const startDate = new Date(training.date);
      const endDate = new Date(startDate.getTime() + training.duration * 60000);

      let customerName = "N/A";
      if (training.customer && typeof training.customer !== "string") {
        const { firstname, lastname } = training.customer;
        customerName = `${firstname ?? ""} ${lastname ?? ""}`.trim();
      }

      return {
        title: `${training.activity} / ${customerName}`,
        start: startDate,
        end: endDate,
        resource: training,
      };
    });
    setEvents(calendarEvents);
  }, [trainings]);

  return (
    <div style={{ padding: "20px", height: "calc(100vh - 150px)" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        view={view}
        onView={(newView) => setView(newView as "month" | "week" | "day")}
        allDayAccessor={() => false}
        showMultiDayTimes
        eventPropGetter={() => ({
          style: {
            backgroundColor: "var(--primary-color)",
            color: "white",
            borderRadius: "5px",
            border: "none",
          },
        })}
        dayPropGetter={(date) => ({
          style: {
            backgroundColor: dayjs(date).isSame(dayjs(), "day") ? "#e6f0ff" : undefined,
          },
        })}
      />
    </div>
  );
}




