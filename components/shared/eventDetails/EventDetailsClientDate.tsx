"use client";

import { formatDateTime } from "@/lib/utils";

const EventDetailsClientDate = ({
  classes,
  eventDateStart,
  eventDateEnd,
}: {
  classes: string;
  eventDateStart: string;
  eventDateEnd: string;
}) => {
  return (
    <p className={classes}>
      {`${formatDateTime(eventDateStart)} - ${formatDateTime(eventDateEnd)}`}
    </p>
  );
};

export default EventDetailsClientDate;
