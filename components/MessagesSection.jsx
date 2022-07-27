import { Stack, Typography } from "@mui/material";
import { Message } from "./Message";
import { grey } from "@mui/material/colors";

export function MessagesSection({ messages }) {
	// comments.sort((a, b) => b.commentTime - a.commentTime);

	return (
		<Stack
			sx={{
				marginTop: "1rem",
				overflow: "hidden",
				overflowY: "scroll",
				width: "100%",
			}}
		>
			{messages?.length === 0 && (
				<Typography
					variant="caption"
					fontStyle="italic"
					color={grey[600]}
					sx={{ paddingRight: "2rem" }}
				>
					Begin the conversation
				</Typography>
			)}
			{messages.map((message, index) => (
				<Message key={index} message={message} />
			))}
		</Stack>
	);
}
