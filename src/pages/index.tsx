import React from "react";
import { type GetServerSidePropsContext, type NextPage } from "next";

import { BestModsPage } from "@components/main";
import HeadInfo from "@components/head";

import ModBrowser from "@components/mod_browser";

const Home: NextPage<{ cookies: { [key: string]: string } }> = ({ cookies }) => {
    return (
        <>
            <HeadInfo />
            <BestModsPage
                cookies={cookies}
                showFilters={true}
            >
                <ModBrowser visible={true} />
            </BestModsPage>
        </>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies: { [key: string]: string | undefined; } = { ...ctx.req.cookies };

    return { 
        props: { 
            cookies: cookies
        }
    };
}

export default Home;
