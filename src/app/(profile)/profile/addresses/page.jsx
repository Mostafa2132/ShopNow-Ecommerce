"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FiMapPin, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useState } from "react";
import Add_Address_Modal from "../../../../Components/Add_Address_Modal/Add_Address_Modal";
import SimpleLoad from "../../../../Components/SimpleLoad/SimpleLoad";
import { toast } from "react-toastify";
import SimpleError from "../../../../Components/SimpleError/SimpleError";
import AddressCard from "../../../../Components/AddressCard/AddressCard";
import { Helmet } from "react-helmet";

async function GetAddresses(token) {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/addresses",
    {
      headers: { token },
    },
  );
  return data.data;
}

async function DeleteAddress(addressId, token) {
  const { data } = await axios.delete(
    `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
    {
      headers: { token },
    },
  );
  return data;
}

export default function Addresses() {
  const { token } = useSelector((store) => store.authReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get all Addresses
  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => GetAddresses(token),
    staleTime: 1000 * 60 * 5,
  });

  // Delete Address Mutation
  const deleteMutation = useMutation({
    mutationFn: (addressId) => DeleteAddress(addressId, token),
    onMutate: () => {
      toast.loading("Deleting address...", { toastId: "delete-address" });
    },
    onSuccess: () => {
      toast.success("Address deleted successfully!", { id: "delete-address" });
      queryClient.invalidateQueries(["addresses"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete address";
      toast.error(errorMessage, { id: "delete-address" });
    },
    onSettled: () => {
      toast.dismiss("delete-address");
    },
  });

  const handleAddressAdded = () => {
    queryClient.invalidateQueries(["addresses"]);
  };

  const handleDeleteAddress = (addressId, addressName) => {
    if (window.confirm(`Are you sure you want to delete "${addressName}"?`)) {
      deleteMutation.mutate(addressId);
    }
  };

  if (isLoading) {
    return <SimpleLoad />;
  }

  if (isError) return <SimpleError />;

  return (
    <>
      <Helmet>
        <title>ShopNow | Address </title>
      </Helmet>
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white">My Addresses</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <FiPlus size={20} />
            Add Address
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                deleteMutation={deleteMutation}
                handleDeleteAddress={handleDeleteAddress}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
            <FiMapPin className="text-slate-600 mx-auto mb-4" size={48} />
            <h3 className="text-white font-bold text-xl mb-2">
              No Addresses Yet
            </h3>
            <p className="text-slate-400 mb-6">
              Add your first address to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Add Address
            </button>
          </div>
        )}
      </section>

      <Add_Address_Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSuccess={handleAddressAdded}
      />
    </>
  );
}
