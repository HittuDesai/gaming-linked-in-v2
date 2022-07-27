import { Stack, Typography } from "@mui/material";
import { Message } from "./Message";
import { grey } from "@mui/material/colors";

export function MessagesSection({ messages, height }) {
	return (
		<Stack
			rowGap="1rem"
			sx={{
				overflow: "hidden",
				overflowY: "scroll",
				width: "100%",
				maxHeight: height,
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
			{messages.map((message, index) => {
				let scrollIntoViewBool = false;
				if (index + 1 === messages.length) scrollIntoViewBool = true;
				return (
					<Message
						key={index}
						message={message}
						scrollIntoViewBool={scrollIntoViewBool}
					/>
				);
			})}
		</Stack>
	);
}
