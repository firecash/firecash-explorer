import Github from "../assets/github.svg";
import { BRAND } from "../config/brand";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="sm:text-md mt-auto flex w-full flex-col items-start rounded-t-4xl bg-[#101017] px-4 pb-6 text-gray-900 sm:px-24 sm:pb-6">
      <span className="pt-12 text-3xl font-bold tracking-tight sm:pt-14">
        Fire<span className="text-primary">Cash</span>
      </span>

      <div className="flex w-full flex-row justify-start pt-9 text-gray-500">
        <span>Explore</span>
        <span className="ms-auto hidden sm:block">Help improve the service</span>
      </div>
      <div className="jusitfy-around mt-1 flex w-full flex-row flex-wrap gap-x-6 gap-y-5 text-gray-900 sm:mt-2 sm:gap-x-10">
        <Link to={"/blocks"} className="link-container">
          Blocks
        </Link>
        <Link to={"/transactions"} className="link-container">
          Transactions
        </Link>
        <Link to={"/addresses"} className="link-container">
          Addresses
        </Link>
        <span className="ms-auto hidden sm:block">
          <Link to={"/donate"} className="link-container">
            Donate
          </Link>
        </span>
      </div>

      <span className="mt-4 block text-gray-500 sm:hidden">Help improve the service</span>
      <span className="mt-1 block sm:hidden">
        <Link to={"/donate"} className="link-container ms-auto hidden sm:block">
          Donate
        </Link>
      </span>

      <div className="my-4 h-[1px] w-full bg-gray-300" />

      <div className="jusitfy-start flex w-full flex-row gap-x-6 fill-gray-500 text-gray-500">
        <a href={BRAND.repoUrl} target="_blank">
          <Github className="h-6 w-6 hover:cursor-pointer hover:fill-gray-900" />
        </a>

        <span className="ms-auto hidden text-nowrap sm:block">© 2026 FireCash Explorer. All rights are reserved</span>
      </div>

      <span className="pt-4 text-nowrap text-gray-500 sm:hidden">© 2026 FireCash Explorer. All rights are reserved</span>
    </div>
  );
};

export default Footer;
