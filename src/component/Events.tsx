import React, { useState, useRef } from "react";
import { Play, Pause, Plus } from "react-feather";
import { api } from "~/utils/api";

export default function Events({
  id,
  captureVideoFrame,
  playahead,
  handleGoToTime,
}: {
  id: string;
  captureVideoFrame: () => Buffer | undefined;
  playahead: number;
  handleGoToTime: (value: number) => void;
}) {
  const { refetch, data: eventsData } = api.tag.getEventsByTapeId.useQuery(id);
  const {
    mutate,
    data: mutationData,
    isLoading,
  } = api.tag.addEvent.useMutation({
    onSuccess: async () => {
      setNewEvents([]);
      await refetch();
    },
  });
  const [newEvents, setNewEvents] = useState<
    { name: string; description: string; time: number; thumbnail: Buffer }[]
  >([]);

  return (
    <>
      {newEvents.map((event, i) => {
        const nameChange = (v: string) =>
          setNewEvents([
            ...newEvents.slice(0, i),
            { ...event, name: v },
            ...newEvents.slice(i + 1),
          ]);
        const descriptionChange = (v: string) =>
          setNewEvents([
            ...newEvents.slice(0, i),
            { ...event, description: v },
            ...newEvents.slice(i + 1),
          ]);
        return (
          <div
            key={`input_${i}`}
            className="flex flex-col justify-center md:flex-row"
          >
            <img
              className="max-h-32 max-w-[8rem] justify-self-center"
              alt=""
              src={window.URL.createObjectURL(
                new window.Blob([event.thumbnail])
              )}
            />
            <div className="mx-2">
              <div className="flex max-h-32 flex-col">
                <input
                  placeholder="Name"
                  className="mb-1"
                  value={event.name}
                  onChange={(e) =>
                    e.target?.value && nameChange(e.target.value)
                  }
                />
                <textarea
                  placeholder="Description"
                  value={event.description}
                  onChange={(e) =>
                    e.target?.value && descriptionChange(e.target.value)
                  }
                  rows={5}
                />
              </div>
            </div>
            <div>
              <button>
                <Plus
                  onClick={() =>
                    mutate({
                      name: event.name,
                      desc: event.description,
                      tapeId: id,
                      time: event.time,
                      thumbnail: event.thumbnail.toString("base64"),
                    })
                  }
                />
              </button>
            </div>
          </div>
        );
      })}
      <div>
        <button
          className="w-full bg-purple-300"
          onClick={() => {
            const buf = captureVideoFrame();
            if (!buf) throw Error("No frame captured");

            setNewEvents([
              ...newEvents,
              { name: "", description: "", thumbnail: buf, time: playahead },
            ]);
          }}
        >
          Add Event at {Math.round(playahead / 60)}:
          {(playahead % 60).toString().padStart(2, "0")}
        </button>
        {eventsData?.map((event, i) => {
          return (
            <div
              className="mx-2 flex flex-col justify-start md:flex-row"
              key={`events_${i}`}
              data-id={event.id}
              onClick={() => {
                handleGoToTime(event.time);
              }}
            >
              <img
                className="max-h-32 max-w-[8rem] justify-self-start"
                alt=""
                src={event.thumnailUrl}
              />
              <div className="mx-2">
                <div className="mb-1 flex max-h-32 flex-col">
                  {event.tag.name}

                  <div>{event.tag.desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
