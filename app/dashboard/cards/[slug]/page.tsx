"use client";

import React, {
  useState,
  useEffect,
  useContext
} from "react";
import { useRouter } from "next/navigation";
import { DashboardContext } from "@/app/context/DashboardContext";
import { CardsTableType } from "@/app/utils/types/supabase/cardsTableType";
import fetchCards from "@/app/lib/actions/supabase-data/fetchCardData";
import CardRender from "@/app/components/card-creator/CardRender";
import Link from "next/link";
import { format } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IosShareIcon from "@mui/icons-material/IosShare";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LoginIcon from "@mui/icons-material/Login";
import { FaDiscord } from "react-icons/fa";

export default function Card({
   params 
}: {
   params: { slug: string } 
}) {
  const { userProfileData } = useContext(DashboardContext);
  const router = useRouter();

  const [isCardOwner, setIsCardOwner] = useState<boolean>(false);
  const [createNewCardHref, setCreateNewCardHref] = useState<string>("/login");
  const [createNewCardHrefIcon, setCreateNewCardHrefIcon] = useState<React.ReactNode>(<LoginIcon />);
  const [cardData, setCardData] = useState<CardsTableType | null>(null);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch card data from Supabase
  useEffect(() => {
    const loadCardData = async () => {
      const cardId = parseInt(params.slug, 10);
      const cards = await fetchCards({
        from: "cards",
        filter: {
          column: "id",
          value: cardId
        },
      });

      // Update this to make cards public or private
      if (cards && cards.length > 0) {
        const card = cards[0];
        setCardData(card);
        setIsCardOwner(card.cardCreator === userProfileData?.username);
      } else {
        console.error("Card not found.");
      }
    };
    loadCardData();
  }, [params.slug, userProfileData?.username]);

  // Check if current user is the card creator
  useEffect(() => {
    if (cardData?.cardCreator === userProfileData?.username) {
      setIsCardOwner(true);
      setCreateNewCardHref("/dashboard/create");
      setCreateNewCardHrefIcon(<DesignServicesIcon />);
    }
  }, [cardData, userProfileData?.username]);

  // Format date from card data
  useEffect(() => {
    if (cardData) {
      const formattedDate = format(new Date(cardData.created_at), 'MMMM dd, yyyy');
      setFormattedDate(formattedDate);
    }
  }, [cardData]);

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
    router.push(`/dashboard/cards/${cardData?.id}/edit`);
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
        px-6
        lg:px-12
        gap-4
        bg-neutral-900
        lg:bg-transparent
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
        {cardData ? (<Typography
          className="
            text-white
          "
        >
          {cardData?.cardName || "Card"}
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
          {/* Card Render Container */}
          <Box
            id="card-render-container"
            className="
              flex
              flex-col
              justify-center
              items-center
              w-full
              py-4
              px-6
            "
          >
            <Box
              className="flex flex-row justify-center items-center w-full gap-6"
            >
              {/* Card Render */}
              {cardData && cardData?.id && (
                <div className="flex flex-col gap-2">
                  <CardRender
                    cardData={cardData} 
                  />
                </div>
              )}
            </Box>
            
          </Box>
          
          {/* Card Details */}
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
                  {cardData ? (
                    <Typography
                      variant="h4"
                      className="
                        font-medium
                        text-white
                      "
                    >
                      {cardData?.cardName}
                    </Typography>
                  ) : (
                    <Skeleton
                      variant="text"
                      width={200}
                      height={32}
                      animation="wave"
                    />
                  )}
                  {cardData ? (<Typography
                    variant="overline"
                    component="span"
                    className="
                      font-medium
                    "
                  >
                    by {""}
                    <Link href={`/dashboard/profile/${cardData?.cardCreator}`}>
                      <Typography
                        variant="overline"
                        className="
                          font-medium
                          text-teal-500
                          hover:cursor-pointer
                          hover:text-teal-400
                        "
                      >
                        {cardData?.cardCreator}
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
                {cardData ? (<Typography
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
              {
              isCardOwner && 
              cardData && (
                <Box
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
                    disabled={!isCardOwner}
                    aria-label="edit"
                    size="small"
                    onClick={handleEdit}
                    className="
                      opacity-50
                      hover:opacity-100
                    "
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    disabled={!isCardOwner} // Disabled until delete functionality is implemented
                    aria-label="delete"
                    size="small"
                    onClick={handleDelete}
                    className="
                      opacity-50
                      hover:opacity-100
                      hover:text-red-500
                    "
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
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
              {isCardOwner ? (
                <Button
                  disabled={true} // Disabled until download functionality is implemented
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  className="
                    w-full
                  "
                >
                  Download Card
                </Button>
              ) : (
                <Link
                  href={createNewCardHref}
                  className="w-full"
                >
                  <Button
                    disabled={true} // Disabled until share functionality is implemented
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={createNewCardHrefIcon}
                    className="
                      w-full
                    "
                  >
                    Join & create card
                  </Button>
                </Link>
              )}
              <a
                href="https://discord.gg/HENgvaAmk2"
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<FaDiscord />}
                  className="
                    w-full
                  "
                >
                  View on Discord
                </Button>
              </a>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<IosShareIcon />}
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
              Share {cardData?.cardName || "card"}
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
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}