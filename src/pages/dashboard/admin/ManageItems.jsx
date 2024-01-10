
import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaTrashAlt } from "react-icons/fa";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // You can adjust the formatting options here
};

const AllMessages = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch, data: messages = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/messages");
      return res.data;
    },
  });

  return (
    <div className="max-w-screen-lg mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-8">All Messages</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-green-100 border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-green-500 text-white text-lg font-medium uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Swap Request ID</th>
              <th className="px-6 py-4">Messages</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{message.swapRequestId}</td>
                <td className="px-6 py-4">
                  {message.messages.map((msg, msgIndex) => (
                    <div key={msgIndex} className="mb-3">
                      <p className="font-semibold">{msg.currentUseremail}</p>
                      <p>{msg.text}</p>
                      <p className="text-gray-500">{formatDate(msg.timestamp)}</p>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllMessages;
