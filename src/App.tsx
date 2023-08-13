import Mentions from './components/Mentions';
import { InputBase, MenuItem, styled } from '@mui/material';

const StyledMenuItem = styled(MenuItem)(() => ({
  color: 'white',
  paddingInline: '11px',
  borderRadius: '3px',
  '&:hover,&.Mui-focusVisible': {
    background: '#35373c'
  }
}));

export default function App() {
  return (
    <Mentions
      data={data}
      onItemRender={({ index, value, setItemRef, onClick, props }) => (
        <StyledMenuItem key={index} onClick={onClick} ref={setItemRef} {...props}>
          @{value}
        </StyledMenuItem>
      )}
    >
      {({ inputRef, ...props }) => (
        <InputBase
          fullWidth
          multiline
          maxRows={17}
          placeholder='Message @MACM'
          inputRef={inputRef}
          {...props}
          sx={{
            padding: '11px 16px',
            borderRadius: '8px',
            background: '#383A40',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 15 / 16 + 'rem',
            lineHeight: 22 / 15,
            caretColor: 'currentColor',
            '& input': {
              padding: 0
            }
          }}
        />
      )}
    </Mentions>
  );
}

const data = [
  'johnsmith',
  'maryjones',
  'davidmiller',
  'lindawilliams',
  'michaelbrown',
  'susanmartinez',
  'williamdavis',
  'sarahrodriguez',
  'robertmartin',
  'patriciathompson',
  'jamesanderson',
  'jenniferlee',
  'charleslopez',
  'elizabethperez',
  'richardharris',
  'mariajackson',
  'josephhernandez',
  'jessicamartinez',
  'thomasgreen',
  'nancywhite',
  'danielhall',
  'karenmiller',
  'matthewadams',
  'lindawright',
  'christopherjames',
  'elizabethmiller',
  'danieljohnson',
  'laurajohnson',
  'williamthomas'
];
