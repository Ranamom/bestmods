import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

import { trpc } from "@utils/trpc";

import DownArrow2 from "@utils/icons/down_arrow2";
import UpArrow2 from "@utils/icons/up_arrow2";

const RatingRender: React.FC<{
    mod: any,
    classes?: string[],
    rating?: number
}> = ({
    mod,
    classes,
    rating
}) => {
    // Convert to number instead of BigInt.
    rating = Number(mod.rating ?? rating ?? 1);

    // This stores a temporary rating value for when the user submits a rating.
    const [tempRatingVal, setTempRatingVal] = useState<number | undefined>(undefined);

    // Retrieve session.
    const { data: session } = useSession();

    // Retrieve rating.
    const cur_rating = mod.ModRating[0] ?? null;

    const modRequiresUpdateMut = trpc.mod.requireUpdate.useMutation();

    // Controls whether user rated this mod or not.
    const [didRate, setDidRate] = useState(false);
    const [rateIsPositive, setRateIsPositive] = useState(false);

    if (cur_rating && !didRate) {
        if (cur_rating.positive)
            setRateIsPositive(true);

        setDidRate(true);
    }

    const myRatingMut = trpc.modRating.addModUserRating.useMutation();

    // Arrow classes.
    const classes_up = ["w-12", "h-12", "text-center"];
    const classes_down = ["w-12", "h-12", "text-center"];

    if (didRate) {
        if (rateIsPositive)
            classes_down.push("opacity-20");
        else
            classes_up.push("opacity-20");
    }

    // Container classes.
    let classes_container = "mod-rating-container";

    if (classes)
        classes_container = classes_container + " " + classes.join(" ");

    return (
        <div className={classes_container}>
            <div>
                <button onClick={(e) => {
                    e.preventDefault();

                    // Submit negative rating.
                    if (session?.user) {
                        if (didRate && !rateIsPositive)
                            return;

                        myRatingMut.mutate({
                            userId: session.user.id,
                            modId: mod.id,
                            positive: false
                        });

                        // Set temporary rating value.
                        setTempRatingVal((rating ?? 1) - 1);

                        // Require updating.
                        modRequiresUpdateMut.mutate({ id: mod.id });

                        setDidRate(true);
                        setRateIsPositive(false);
                    } else if (session?.user == null)
                        signIn("discord");
                }}>
                    <DownArrow2
                        classes={classes_down}
                    />
                </button>
            </div>
            <div>
                <span>{tempRatingVal?.toString() ?? rating?.toString() ?? 1}</span>
            </div>
            <div>
                <button onClick={(e) => {
                    e.preventDefault();

                    // Submit positive rating.
                    if (session?.user) {
                        if (didRate && rateIsPositive)
                            return;

                        myRatingMut.mutate({
                            userId: session.user.id,
                            modId: mod.id,
                            positive: true
                        });

                        // Set temporary rating value.
                        setTempRatingVal((rating ?? 1) + 1);

                        // Require updating.
                        modRequiresUpdateMut.mutate({ id: mod.id });

                        setDidRate(true);
                        setRateIsPositive(true);
                    } else if (!session?.user)
                        signIn("discord");
                }}>
                    <UpArrow2
                        classes={classes_up}
                    />
                </button>
            </div>
        </div>
    );
}

export default RatingRender;