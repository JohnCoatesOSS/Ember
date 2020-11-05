import * as React from 'react';

type Colors = 'black' | 'grey';
type FontFamilies = 'sans' | 'mono';
type FontSizes = -1 | 0 | 1 | 2 | 3 | 4 | 5;
type FontWeights = 'medium' | 'bold';

type TailwindProps = {
  [propName: string]: any;
  textColor?: Colors;
  fontFamily?: FontFamilies;
  fontSize?: FontSizes;
  fontWeight?: FontWeights;
  width?: 0 | 'screen';
  height?: 0 | 'screen';
  padding?: 0 | 1 | 2 | 3 | 4| 5 | 6;
};

interface Props {
  children?: React.ReactNode;
  properties?: TailwindProps;
}

interface State {}

class StyledComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const classes: any = [];

    if (!this.props.properties) {
      return <div />;
    }

    var classNames: string = ""

    Object.keys(this.props.properties).map((key) => {
      let prefix: string;

      switch (key) {
        case 'padding': prefix = 'p'; break;
        case 'textColor': prefix = 'text'; break;
        case 'fontSize': prefix = 'text'; break;
        case 'fontWeight': prefix = 'font'; break;
        default: prefix = key;
      }

      if (this.props.properties && this.props.properties[key]) {
          let name = `${prefix}-${this.props.properties[key]}`
          classes[name] = true;
          classNames += `${name} `
      }

    });

    return (
      <div className={classNames}>{this.props.children}</div>
    );
  }
}

export const Styled = StyledComponent;
