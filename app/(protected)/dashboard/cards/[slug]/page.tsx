"use client";

import React, {
  useState,
  useEffect,
  useContext
} from "react";
import { DashboardContext } from "@/app/context/DashboardContext";
import { CardsTableType } from "@/app/utils/types/supabase/cardsTableType";
import fetchCards from "@/app/lib/actions/supabase-data/fetchCardData";
import Image from "next/image";
import Link from "next/link";
import { format } from 'date-fns';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Modal,
  Skeleton,
  Breadcrumbs
} from "@mui/material"
import {
  Delete,
  Edit,
  IosShare,
  Download,
  Close,
  DesignServices,
  Login
} from "@mui/icons-material"

export default function Card({
   params 
}: {
   params: { slug: string } 
}) {
  
  const [isCardOwner, setIsCardOwner] = useState<boolean>(false);
  const [createNewCardHref, setCreateNewCardHref] = useState<string>("/login");
  const [createNewCardHrefIcon, setCreateNewCardHrefIcon] = useState<React.ReactNode>(<Login />);
  const [card, setCard] = useState<CardsTableType | null>(null);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { userProfileData } = useContext(DashboardContext);

  // Fetch card data from Supabase
  useEffect(() => {
    const loadCardData = async () => {
      const cards = await fetchCards({
        from: "cards",
        filter: { column: "id", value: params.slug },
      });

      if (cards && cards.length > 0) {
        const card = cards.find(
          card => card.cardCreator ===
          userProfileData?.username
        );
        if (card) {
          setCard(card);
        } else {
          console.error("Card not found or does not belong to the current user.");
        }
      }
    };

    if (userProfileData?.username) {
      loadCardData();
    }
  }, [params.slug, userProfileData?.username]);

  // Format date from card data
  useEffect(() => {
    if (card) {
      const formattedDate = format(new Date(card.created_at), 'MMMM dd, yyyy');
      setFormattedDate(formattedDate);
    }
  }, [card]);

  // Check if current user is the card creator
  useEffect(() => {
    if (card?.cardCreator === userProfileData?.username) {
      setIsCardOwner(true);
      setCreateNewCardHref("/dashboard/create");
      setCreateNewCardHrefIcon(<DesignServices />);
    }
  }, [card, userProfileData?.username]);

  function handleDownload() {
    console.log("Download button clicked");
    // TODO: Implement download functionality
    // Import and invoke Supabase download function
  };

  function handleShare() {
    console.log("Share button clicked");
    setModalOpen(true);
  }

  function handleEdit() {
    console.log("Edit button clicked");
    // TODO: Implement edit functionality
    // Redirect to cards/[slug]/edit
  };

  function handleDelete() {
    console.log("Delete button clicked");
    // TODO: Implement delete functionality
    // Import and invoke Supabase delete function
  }

  // TODO: If card not found, display a message
  // TODO: If current user = card creator, allow sharing / downloading
  // TODO: If current user = card creator, allow editing
  // TODO: If current user != card creator, allow viewing only

  return (
    <Box
      id="card-container-outer"
      className="
        flex
        flex-col
        justify-start
        items-center
        w-full
        py-4
        px-12
        gap-4
      "
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        className="
          w-full
          text-neutral-500
        "
      >
        <Link
          href="/dashboard/cards"
        >
          <Typography
            className="
              hover:text-neutral-300
            "
          >
            Cards
          </Typography>
        </Link>
        {card ? (<Typography
          className="
            text-white
          "
        >
          {card?.cardName || "Card"}
        </Typography>
        ) : (
          <Skeleton
            variant="text"
            width={100}
            height={34}
            animation="wave"
          />
        )}
      </Breadcrumbs>
      <Box
        id="card-countainer-inner"
        className="
          flex
          flex-col
          justify-start
          items-center
          w-full
          bg-neutral-800
          border
          border-neutral-700
          rounded-lg
          shadow-xl
          shadow-950/50
        "
      >
        <Box
          className="
            flex
            flex-col
            justify-center
            items-center
            w-full
          "
        >
          {card ? (<Box
            id="card-image-container"
            sx={{
              overflow: "hidden",
              position: "relative",
              aspectRatio: "5/7",
              maxWidth: "400px",
            }}
            className="
              flex
              flex-col
              justify-center
              items-center
              w-full
              pt-4
              pb-6
              m-4
              rounded-2xl
              shadow-lg
            shadow-neutral-950/25
            "
          >
            <Image
              src={card?.cardRender || "/images/nexus-cardback.png"}
              fill
              style={{ objectFit: "cover" }}
              alt={card?.cardName || "Card image"}
              priority
            />
          </Box>) : (
            <Skeleton
              variant="rectangular"
              width={400}
              height={560}
              animation="wave"
              className="
                flex
                flex-col
                justify-center
                items-center
                w-full
                pt-4
                pb-6
                m-4
                rounded-2xl
                shadow-lg
              shadow-neutral-950/25
              "
            />
          )}
          <Box
            id="card-details-container"
            className="
              flex
              flex-col
              justify-between
              items-start
              w-full
              h-full
              bg-neutral-900
              rounded-b-lg
              mt-2
            "
          >
            <Box
              id="card-details-text-container"
              className="
                flex
                flex-row
                justify-between
                items-start
                w-full
                h-full
                p-4
              "
            >
              <Box
                id="card-details-text"
                className="
                  flex
                  flex-col
                  justify-start
                  items-baseline
                "
              >
                <Box
                  id="card-details-name-creator"
                  className="
                    flex
                    flex-row
                    justify-start
                    items-baseline
                    gap-2
                  "
                >
                  {card ? (
                    <Typography
                      variant="h4"
                      className="
                        font-medium
                        text-white
                      "
                    >
                      {card?.cardName}
                    </Typography>
                  ) : (
                    <Skeleton
                      variant="text"
                      width={200}
                      height={32}
                      animation="wave"
                    />
                  )}
                  {card ? (<Typography
                    variant="overline"
                    component="span"
                    className="
                      font-medium
                    "
                  >
                    by {""}
                    <Link href={`/dashboard/profile/${card?.cardCreator}`}>
                      <Typography
                        variant="overline"
                        className="
                          font-medium
                          text-lime-500
                          hover:cursor-pointer
                          hover:text-lime-300
                        "
                      >
                        {card?.cardCreator}
                      </Typography>
                    </Link>
                  </Typography>
                  ) : ( 
                    <Skeleton
                      variant="text"
                      width={100}
                      height={32}
                      animation="wave"
                    />
                  )}
                </Box>
                {card ? (<Typography
                  variant="overline"
                  className="
                    font-medium
                    text-neutral-500
                  "
                >
                  created {formattedDate}
                </Typography>
                ) : (
                  <Skeleton
                    variant="text"
                    width={200}
                    height={20}
                    animation="wave"
                  />
                )}
              </Box>
              {userProfileData?.username === card?.cardCreator && card && (<Box
                id="crud-buttons-container"
                className="
                  flex
                  flex-row
                  justify-end
                  items-center
                  gap-1
                "
              >
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={handleEdit}
                  className="
                    opacity-50
                    hover:opacity-100
                  "
                >
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={handleDelete}
                  className="
                    opacity-50
                    hover:opacity-100
                    hover:text-red-500
                  "
                >
                  <Delete />
                </IconButton>
              </Box>)}
            </Box>
            <Box
              id="card-details-buttons-container"
              className="
                flex
                md:flex-row
                flex-col
                justify-between
                items-center
                w-full
                px-4
                pb-4
                gap-2
              "
            >
              <Link
                href={createNewCardHref}
                className="w-full"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={createNewCardHrefIcon}
                  className="
                    w-full
                  "
                >
                  {isCardOwner ? "Create card" : "Join & create card"}
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Download />}
                onClick={handleDownload}
                className="
                  w-full
                "
              >
                Download Card
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<IosShare />}
                onClick={handleShare}
                className="
                  w-full
                "
              >
                Share Card
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="
          flex
          flex-col
          justify-center
          items-center
          w-full
          max-w-4xl
          m-auto
          md:p-auto
          p-12 
        "
      >
        <Box
          id="share-card-modal-container"
          className="
            flex
            flex-col
            justify-center
            items-center
            w-full
            p-6
            gap-4
            bg-neutral-800
            border
            border-neutral-700
            rounded-lg
            shadow-xl
            shadow-neutral-950/50
          "
        >
          <Box
            id="share-card-modal-header"
            className="
              flex
              flex-row
              justify-between
              items-center
              w-full
            "
          >
            <Typography
              variant="h4"
              className="
                text-white
              "
            >
              Share {card?.cardName || "card"}
              {/* Share on Discord */}
              {/* Share on Reddit */}
              {/* Share on X */}
            </Typography>
            <IconButton
              aria-label="close"
              size="small"
              className="
                opacity-50
                hover:opacity-100
              "
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}