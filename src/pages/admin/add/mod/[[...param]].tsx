import React from "react";
import { type GetServerSidePropsContext, type NextPage } from "next";

import { BestModsPage } from "@components/main";
import HeadInfo from "@components/head";

import ModForm from "@components/forms/contributor/create_mod";

import { prisma } from "@server/db/client";
import { getSession } from "next-auth/react";

import { type CategoriesWithChildren } from "types/category";
import { type ModWithRelations } from "types/mod";
import { type Source } from "@prisma/client";

import { Has_Perm } from "@utils/permissions";

const Home: NextPage<{
    authed: boolean,
    cats: CategoriesWithChildren[],
    srcs: Source[],
    mod: ModWithRelations
}> = ({
    authed,
    cats,
    srcs,
    mod
}) => {
    return (
        <>
            <HeadInfo />
            <BestModsPage>
                {authed ? (
                    <div className="container mx-auto">
                        <ModForm cats={cats} srcs={srcs} mod={mod} />
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <h1 className="text-center text-white font-bold text-lg">You are not authorized to add or edit a mod!</h1>
                    </div>                    
                )}
            </BestModsPage>
        </>
    );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // Slugs.
    let url: string | null = null;
    let id: number | null = null;

    // Props to pass.
    let cats: CategoriesWithChildren[] = [];
    let srcs: Source[] = [];
    let mod: ModWithRelations | null = null;
    let authed = false;

    // See if we have a slug.
    if (ctx?.params?.param && ctx.params.param[0]) {
        const param = ctx.params.param[0];

        if (isNaN(Number(param)))
            url = param;
        else
            id = Number(param);
    }

    // Retrieve session.
    const session = await getSession(ctx);

    // Make sure we have contributor permissions.
    const perm_check = session && (Has_Perm(session, "admin") || Has_Perm(session, "contributor"))

    if (perm_check)
        authed = true;

    if (authed) {
        // Retrieve all categories.
        cats = await prisma.category.findMany({
            where: {
                parentId: null
            },
            include: {
                children: true
            }
        });

        // Retrieve all sources.
        srcs = await prisma.source.findMany();

        // Retrieve mod if any.
        if (id || url) {
            mod = await prisma.mod.findFirst({
                where: {
                    ...(id && {
                        id: id
                    }),
                    ...(url && {
                        url: url
                    })
                },
                include: {
                    category: true,
                    ModDownload: true,
                    ModScreenshot: true,
                    ModSource: true,
                    ModInstaller: true,
                    ModCredit: true
                }
            });
        }
    }

    return { 
        props: {
            authed: authed,
            cats: cats,
            srcs: srcs,
            mod: JSON.parse(JSON.stringify(mod, (_, v) => typeof v === "bigint" ? v.toString() : v))
        } 
    };
}

export default Home;
